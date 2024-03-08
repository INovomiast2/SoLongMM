let isEditorLoading = true;

setTimeout(() => {
    Promise.all([
        import('./map.js'),
        import('./generate.js'),
        import('./save.js')
      ]).then(() => {
        isEditorLoading = false;
        document.querySelector('.editor-loading-container').style.display = 'none';
        document.querySelector('header').style.display = 'block';
      });
}, 3500);

// Handling sidebar tiles
let tiles = ['https://streak.club/img/Mix1c2VyX2NvbnRlbnQvdXBsb2Fkcy9pbWFnZS8zMjYzMi5wbmc=/600x600%23/gvhkAS.png', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnQ5wiJVLhyv_DAmLzqj111mcH1SErkztkHw&usqp=CAU']; // Assuming these should be paths to tile images

const tileContainer = document.getElementById('sidebar-tiles');

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
  });
});
