class Particle {
    constructor(edgeColour, scale){
        this.scale = scale || 1;
        this.rand = random(1);
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(1, 0);
        this.vel.rotate(random(TWO_PI));
        this.vel.mult(this.scale);
        this.past = this.pos.copy();
        this.c = color(0);
        this.edgeColour = edgeColour || color(0);
    }
    
    update(velocity){
        if (!img) return; // Guard against missing image
        
        this.past = this.pos.copy();
        this.pos.add(p5.Vector.mult(this.vel, velocity * this.scale));
        
        // Ensure we're within bounds when sampling pixels
        const x = constrain(int(this.pos.x), 0, img.width - 1);
        const y = constrain(int(this.pos.y), 0, img.height - 1);
        
        const c = img.get(x, y);
        if (!c) return; // Guard against invalid pixel data
        
        const ratio = brightness(c) / 255;
        const curlinessFactor = (typeof curliness !== 'undefined') ? curliness : 1;
        
        this.vel.rotate(random(-HALF_PI * pow(ratio, 3-curlinessFactor), 
                              HALF_PI * pow(ratio, 3-curlinessFactor)));
        
        this.c = color(
            map(ratio, 0, 1, 0, red(this.edgeColour)),
            map(ratio, 0, 1, 0, green(this.edgeColour)),
            map(ratio, 0, 1, 0, blue(this.edgeColour)),
            200 - ratio * 255
        );
    }
    
    show(){
        if (this.c) {
            stroke(this.c);
            line(this.pos.x, this.pos.y, this.past.x, this.past.y);  // Fixed: Added missing y coordinate
        }
    }
}