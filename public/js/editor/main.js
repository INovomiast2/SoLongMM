let isEditorLoading = true;
//const proxy_url = 'https://cors-anywhere.herokuapp.com/';

var tileCounter = 0;

setTimeout(() => {
  Promise.all([
    import('./map.js'),
    import('./generate.js'),
    import('./save.js'),
    import('./new.js')
  ]).then(() => {
    isEditorLoading = false;
    document.querySelector('.editor-loading-container').style.display = 'none';
    document.querySelector('header').style.display = 'block';
  });
}, 3500);

if (!JSON.parse(localStorage.getItem('session'))) {
  window.location.href = '/auth';
}

// Handling sidebar tiles
// Get the tiles from localStorage
let tiles = JSON.parse(localStorage.getItem('currentProject')).tiles != null ? JSON.parse(localStorage.getItem('currentProject')).tiles : [];
for (let i = 0; i < tiles.length; i++) {
  tileCounter++;
}
// Get the tiles
console.log('Tiles:', tiles); // Debugging statement

const tileContainer = document.getElementById('sidebar-tiles');
// If there are no tiles, display a button to import tiles
if (tiles.length === 0) {
  tileContainer.innerHTML = `
    <button id="import-tiles-btn">Import Tiles</button>
  `;

  document.getElementById('import-tiles-btn').addEventListener('click', () => {
    // Open a modal with options of using a file input or a URL input
    const modal = document.createElement('dialog');
    modal.id = 'modal';
    modal.innerHTML = `
      <form id="import-tiles-form">
        <label for="import-tiles-file">Import Tiles</label>
        <input type="file" id="import-tiles-file" accept="image/*" required>
                <button type="submit">Import</button>
              </form>
              <hr style="">
              <form id="import-tiles-form-url">
                <label for="import-tiles-url">Import Tiles</label>
                <input type="url" id="import-tiles-url" required>
                <button type="submit" id="send-url">Import</button>
              </form>
      </form>
            `;
    // Modal Style
    modal.style.width = '500px';
    modal.style.height = '550px';
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
    modal.style.overflowY = 'none';
    // Form Style
    const form = modal.querySelectorAll('form');
    form.forEach(f => {
      f.style.display = 'flex';
      f.style.flexDirection = 'column';
      f.style.alignItems = 'center';
      f.style.justifyContent = 'center';
      f.style.width = '100%';
      f.style.height = '50%';
    });
    // Input Style
    const input = modal.querySelectorAll('input');
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
    });
    // Button Style
    const button = modal.querySelectorAll('button');
    button.forEach(b => {
      b.style.width = '50%';
      b.style.height = '50px';
    });
    document.body.appendChild(modal);
    modal.showModal();

    // Form Submit URL
      document.getElementById('import-tiles-form-url').addEventListener('submit', e => {
        e.preventDefault();
        const url = document.getElementById('import-tiles-url').value;
        // Save the image url in the tiles array
        tiles.push(url);
        // Update the tiles array in localStorage
        localStorage.setItem('currentProject', JSON.stringify({ ...JSON.parse(localStorage.getItem('currentProject')), tiles }));
        modal.close();
        // Append the new tile to the sidebar
        const tileElement = createTileElement(url);
        tileContainer.appendChild(tileElement);
        // Remove the import button
        document.getElementById('import-tiles-btn').remove();
        // Reload page
        location.reload();
      });
    });
}

// Check if tiles have already been appended to prevent duplication
// We check for a specific class that we add to our tiles
if (!tileContainer.querySelector('.editor-sidebar-section-tile')) {
  console.log('Appending tiles:', tiles); // Debugging statement
  tiles.forEach(tilePath => {
    const tileElement = createTileElement(tilePath);
    tileContainer.appendChild(tileElement);
  });
}

// Function to create a tile element
function createTileElement(tilePath) {
  const uniqueId = Math.random().toString(36).substring(2, 15);

  const tile_contents = `
            <img src="${tilePath}" alt="Tile" id="tile-img-${uniqueId}" class="editor-sidebar-section-tile-img" data-active="false">
            <p class="editor-sidebar-section-tile-title">Tile Name</p>
          `;

  const tileElement = document.createElement('div');
  tileElement.classList.add('editor-sidebar-section-tile');
  tileElement.id = 'editor-sidebar-section-tile';
  tileElement.innerHTML = tile_contents;

  return tileElement;
}

// Selecting tile elements and attaching click event listeners
// This should be done after the tiles have been appended to ensure the event listeners are attached
document.querySelectorAll('.editor-sidebar-section-tile img').forEach(tile => {
  tile.addEventListener('click', () => {
    // First, remove 'active' class from all tiles
    document.querySelectorAll('.editor-sidebar-section-tile img').forEach(otherTile => {
      otherTile.classList.remove('active');
      otherTile.dataset.active = "false";
    });

    // Then, add 'active' class to the clicked tile
    tile.classList.add('active');
    tile.dataset.active = "true";
    // Add current tile id to localStorage for later use
    localStorage.setItem('currentTile', tile.id);
  });
});


// Check currentProject is set in localStorage and it's not empty and if not, take the currentProject name and display it in the title of the window
const currentProject = JSON.parse(localStorage.getItem('currentProject'));
if (currentProject && currentProject.name) {
  document.title = `${currentProject.name} - Editor - So Long MM`;
}

document.body.onload = () => {
  const tiles = JSON.parse(localStorage.getItem('currentProject')).tiles;
  console.log("Tiles: ", tiles)
  if (tiles.length > 0) {
    // Append the button to add more tiles
    const addTileButton = document.createElement('button');
    addTileButton.id = 'add-tile-btn';
    addTileButton.innerHTML = '+';
    addTileButton.style.borderRadius = '50%';
    addTileButton.style.width = '50px';
    addTileButton.style.height = '50px';
    addTileButton.style.backgroundColor = '#242424';
    addTileButton.style.color = 'white';
    addTileButton.style.border = 'none';
    addTileButton.style.position = 'absolute';
    addTileButton.style.bottom = '20px';
    addTileButton.style.right = '20px';
    addTileButton.style.fontSize = '30px';
    addTileButton.style.fontWeight = 'bold';
    addTileButton.style.cursor = 'pointer';
    addTileButton.style.boxShadow = '0px 0px 10px 0px black';
    addTileButton.style.transition = '0.3s';
    // Append the button to the sidebar
    document.getElementById('sidebar-tiles').appendChild(addTileButton);
    // Add event listener to the button
    addTileButton.addEventListener('click', () => {
      // Get the modal to add a new tile
      const modal = document.createElement('dialog');
      modal.id = 'modal';
      modal.innerHTML = `
                <form id="import-tiles-form">
                  <label for="import-tiles-file">Import Tiles</label>
                  <input type="file" id="import-tiles-file" accept="image/*" required>
                  <button type="submit">Import</button>
                </form>
                <hr style="">
                <form id="import-tiles-form-url">
                  <label for="import-tiles-url">Import Tiles</label>
                  <input type="url" id="import-tiles-url" required>
                  <button type="submit" id="send-url">Import</button>
              `;
      // Modal Style
      modal.style.width = '500px';
      modal.style.height = '550px';
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
      modal.style.overflowY = 'none';
      // Form Style
      const form = modal.querySelectorAll('form');
      form.forEach(f => {
        f.style.display = 'flex';
        f.style.flexDirection = 'column';
        f.style.alignItems = 'center';
        f.style.justifyContent = 'center';
        f.style.width = '100%';
        f.style.height = '50%';
      });
      // Input Style
      const input = modal.querySelectorAll('input');
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
      });
      // Button Style
      const button = modal.querySelectorAll('button');
      button.forEach(b => {
        b.style.width = '50%';
        b.style.height = '50px';
      });
      document.body.appendChild(modal);
      modal.showModal();

      // Form Submit URL
      document.getElementById('import-tiles-form-url').addEventListener('submit', e => {
        e.preventDefault();
        const url = document.getElementById('import-tiles-url').value;
        // Save the image url in the tiles array
        tiles.push(url);
        // Update the tiles array in localStorage
        localStorage.setItem('currentProject', JSON.stringify({ ...JSON.parse(localStorage.getItem('currentProject')), tiles }));
        modal.close();
        // Remove the import button
        document.getElementById('import-tiles-btn').remove();
        // Reload page
        location.reload();
      });
    });
  }
}

const tileEdit = () => {
  // Get the tile that is being edited
  const tile = document.getElementById(localStorage.getItem('currentTile').toString());
  // Get the tile url from the image  
  const tilePath = tile.src;
  // DEBUGGING
  console.info('Tile Path:', tilePath);
  // Get the tile index
  const index = tiles.indexOf(tilePath);
  // Create the modal
  const modal = document.createElement('dialog');
  modal.id = 'modal';
  modal.innerHTML = `
    <form id="edit-tile-form">
      <label for="edit-tile-title">Tile Image URL</label>
      <input type="text" id="edit-tile-title" value="${tilePath}">
      <button type="submit">Save</button>
    </form>
  `;
  // Modal Style
  modal.style.width = '500px';
  modal.style.height = '550px';
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
  modal.style.overflowY = 'none';
  // Form Style
  const form = modal.querySelectorAll('form');
  form.forEach(f => {
    f.style.display = 'flex';
    f.style.flexDirection = 'column';
    f.style.alignItems = 'center';
    f.style.justifyContent = 'center';
    f.style.width = '100%';
    f.style.height = '50%';
  });
  // Input Style
  const input = modal.querySelectorAll('input');
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
  });
  // Button Style
  const button = modal.querySelectorAll('button');
  button.forEach(b => {
    b.style.width = '50%';
    b.style.height = '50px';
    b.style.cursor = 'pointer';
    // Add event listener to the button
    b.addEventListener('click', e => {
      e.preventDefault();
      // Get the new tile path
      const newTilePath = document.getElementById('edit-tile-title').value;
      // Update the tile path in the tiles array
      tiles[index] = newTilePath;
      // Update the tiles array in localStorage
      localStorage.setItem('currentProject', JSON.stringify({ ...JSON.parse(localStorage.getItem('currentProject')), tiles }));
      // Close the modal
      modal.close();
      // Reload the page
      location.reload();
    });
  });
  document.body.appendChild(modal);
  modal.showModal();
}

// Add event listener on right click over a tile to create a div with options
// Counter of how many tiles are in the sidebar

document.querySelectorAll('.editor-sidebar-section-tile').forEach(tile => {
  tile.addEventListener('contextmenu', e => {
    e.preventDefault();
    let optDiv = document.getElementById('options-div');
    // Check if theres an existant div (If so, remove it)
    // Create the options div
    const optionsDiv = document.createElement('div');
    optionsDiv.id = 'options-div';
    // Set it on the right position of the mouse
    optionsDiv.style.position = 'absolute';
    optionsDiv.style.top = `${e.clientY}px`;
    optionsDiv.style.left = `${e.clientX}px`;
    optionsDiv.style.backgroundColor = '#242424';
    optionsDiv.style.color = 'white';
    optionsDiv.style.borderRadius = '10px';
    optionsDiv.style.width = '150px';
    optionsDiv.style.height = 'auto';
    optionsDiv.style.border = '1px solid black';
    optionsDiv.style.padding = '10px';
    optionsDiv.style.boxShadow = '0px 0px 10px 0px black';
    optionsDiv.style.zIndex = '1000';
    optionsDiv.style.textAlign = 'center';
    // Create the options
    const deleteOption = document.createElement('p');
    deleteOption.innerHTML = `
      <span class="delete-opt-ctx-menu">Delete</span>
    `;
    deleteOption.style.cursor = 'pointer';
    deleteOption.style.marginBottom = '10px';
    deleteOption.addEventListener('click', () => {
      // Delete the tile div
      const tile = e.target.closest('.editor-sidebar-section-tile');
      tile.remove();
      // Delete the tile from the tiles array
      const tilePath = tile.src;
      const index = tiles.indexOf(tilePath);
      tiles.splice(index, 1);
      // Update the tiles array in localStorage
      localStorage.setItem('currentProject', JSON.stringify({ ...JSON.parse(localStorage.getItem('currentProject')), tiles }));
      // Delete the options div
      optionsDiv.remove();
    });

    // Create a edit option
    const editOption = document.createElement('p');
    editOption.innerHTML = `
      <span class="edit-opt-ctx-menu">Edit</span>
    `;
    editOption.style.cursor = 'pointer';
    editOption.style.marginBottom = '10px';
    
    // Call the edit tile function
    editOption.addEventListener('click', tileEdit);

    // Append the options to the div
    optionsDiv.appendChild(editOption);
    optionsDiv.appendChild(deleteOption);
    // Append the div to the body
    document.body.appendChild(optionsDiv);
  });
});


// Add event to listen if the user clicks outside the options div
document.body.addEventListener('click', e => {
  const optionsDiv = document.getElementById('options-div');
  if (optionsDiv) {
    optionsDiv.remove();
  }
});