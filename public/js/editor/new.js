/* New Project */
const newProject = document.getElementById('header-editor-new-prj');

newProject.addEventListener('click', () => {
    // Create a modal to get the project name
    const modal = document.createElement('dialog');
    modal.id = 'modal';
    modal.innerHTML = `
        <form id="new-project-form">
            <label for="project-name">Project Name</label>
            <input type="text" id="project-name" required>
            <!-- Add width and height for the map -->
            <label for="map-width">Map Width</label>
            <input type="number" id="map-width" required>
            <label for="map-height">Map Height</label>
            <input type="number" id="map-height" required>
            <br>
            <button type="submit">Create</button>
        </form>
    `;
    // Modal Style
    modal.style.width = '500px';
    modal.style.height = '400px';
    modal.style.position = 'absolute';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#242424';
    modal.style.color = 'white';
    modal.style.borderRadius = '10px';
    modal.style.border = '1px solid black';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0px 0px 10px 0px black';
    modal.style.zIndex = '1000';
    modal.style.borderRadius = '10px';
    modal.style.overflow = 'hidden';
    // Form Style
    const form = modal.querySelector('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.alignItems = 'center';
    form.style.justifyContent = 'center';
    form.style.width = '100%';
    form.style.height = '100%';
    // Input Style
    const input = form.querySelectorAll('input');
    input.forEach(i => {
        i.style.width = '100%';
        i.style.marginBottom = '20px';
        i.style.padding = '10px';
        i.style.border = 'none';
        i.style.borderRadius = '10px';
        i.style.backgroundColor = '#333333';
        i.style.color = 'white';
        i.style.fontSize = '18px';
        i.style.fontFamily = 'Poppins, sans-serif';
        i.style.textAlign = 'center';
        i.style.marginTop = '10px';
        i.min = 1;
        i.max = 100;
    });
    // Button Style
    const button = form.querySelector('button');
    button.style.width = '50%';
    button.style.height = '50px';
    button.style.backgroundColor = 'royalblue';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';

    // Modal scroll-bar style
    modal.style.overflow = 'auto';

    // Form Submit
    document.body.appendChild(modal);
    modal.showModal();
    // Form Submit
    form.addEventListener('submit', e => {
        e.preventDefault();
        const projectName = document.getElementById('project-name').value;
        const mapWidth = document.getElementById('map-width').value;
        const mapHeight = document.getElementById('map-height').value;
        // Save the project data on an object to save it on the localStorage
        const newProject = {
            name: projectName,
            width: mapWidth,
            height: mapHeight,
            tiles: []
        };

        // Save the project on the localStorage
        localStorage.setItem('currentProject', JSON.stringify(newProject));
        // Close the modal
        modal.remove();

        // Change the title of the page to the project name
        document.title = `${projectName} - Editor - So Long MM`;

        // Add the grid to the body
        document.getElementById('editor-grid').appendChild(grid);
    });
});