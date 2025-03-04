let curliness = 1;
let velocity = 1;
let img;
let particles = [];
let edgeColour;
let scale;
let dropZone;
let fileInput;
let isImageLoaded = false;

function setup() {
    let canvas = createCanvas(1112, 834);
    canvas.drawingContext.willReadFrequently = true;
    
    scale = width / 1112;
    background(255);
    colorMode(HSB, 255);
    edgeColour = color(random(255), random(255), 255, 10);
    
    // Setup file input and drop zone
    dropZone = select('#drop-zone');
    fileInput = select('#file-input');
    
    if (!dropZone || !fileInput) {
        console.error('Required elements not found!');
        return;
    }

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.elt.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Handle drop zone events
    dropZone.elt.addEventListener('dragenter', () => dropZone.addClass('dragover'));
    dropZone.elt.addEventListener('dragleave', () => dropZone.removeClass('dragover'));
    dropZone.elt.addEventListener('drop', handleDrop);
    
    // Handle file input
    dropZone.mousePressed(() => fileInput.elt.click());
    fileInput.elt.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });
    
    // Connect HTML controls
    select('#velocitySlider').input(updateVelocity);
    select('#curlinessSlider').input(updateCurliness);
    select('#saveButton').mousePressed(saveScreenshot);
    
    // Ensure controls are hidden initially
    select('#controls').style('opacity', '0');
    select('#controls').style('pointer-events', 'none');
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    handleFile(file);
}

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        console.error('Please upload an image file');
        return;
    }

    const fileURL = URL.createObjectURL(file);
    loadImage(fileURL, 
        // Success callback
        (loadedImg) => {
            img = loadedImg;
            img.resize(width, 0);
            background(255);
            
            select('#controls').style('opacity', '1');
            select('#controls').style('pointer-events', 'auto');
            dropZone.style('display', 'none');
            
            isImageLoaded = true;
            
            // Initialize particles
            particles = [];
            for(let i = 0; i < 600; i++){
                particles[i] = new Particle(edgeColour, scale);
            }
            
            URL.revokeObjectURL(fileURL);
        },

        (err) => {
            console.error('Error loading image:', err);
        }
    );
}

function updateVelocity() {
    velocity = this.value();
}

function updateCurliness() {
    curliness = this.value();
}

function saveScreenshot() {
    save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".jpg");
}

function draw() {
    if (!isImageLoaded) return;
    
    for(let i = 0; i < particles.length; i++){
        if(particles[i].pos.y < 0 || particles[i].pos.y > height 
           || particles[i].pos.x < 0 
           || particles[i].pos.x > width)
        {
            particles[i] = new Particle(edgeColour);
        }
        
        particles[i].update(velocity);
        particles[i].show();
    }
}

