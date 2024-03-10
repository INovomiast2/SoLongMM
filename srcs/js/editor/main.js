let isEditorLoading = true;

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

// Handling sidebar tiles
// Get the tiles from localStorage
let tiles = JSON.parse(localStorage.getItem('currentProject')?.tiles) || [];

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
      // Fetch the image and add it to the tiles array
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            tiles.push(reader.result);
            localStorage.setItem('tiles', JSON.stringify(tiles));
            modal.close();
          };
          reader.readAsDataURL(blob);
          // Remove the button and append the tiles
          tileContainer.innerHTML = '';
          tiles.forEach(tilePath => {
            const tileElement = createTileElement(tilePath);
            tileContainer.appendChild(tileElement);
          });
          
        });
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
