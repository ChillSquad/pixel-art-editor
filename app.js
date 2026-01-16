const clearButton = document.getElementById('clear-button');
const sizeOfPixelInput = document.getElementById('size-of-pixel');
const pixelsContainer = document.getElementById('pixels-container');
const gridToggleButton = document.getElementById('grid-toggle-button');
const quantityOfPixelsInput = document.getElementById('quantity-of-pixels');
const colorPickerContainer = document.getElementById('color-picker-container');

/* Палитра цветов */

const colors = {
	white: '#ffffff',
	black: '#000000',
	red: '#ff0000',
	orange: '#ffa500',
	yellow: '#ffff00',
	green: '#008000',
	cyan: '#00ffff',
	blue: '#0000ff',
	purple: '#800080',
	pink: '#ffc0cb',
};

/* Значения по умолчанию */

let pixelSize = parseInt(sizeOfPixelInput.value) || 20;
let quantityOfPixels = parseInt(quantityOfPixelsInput.value) || 10;
let selectedColor = colors['black'];
let gridVisible = true;

function setSquaredSize(element, size) {
	element.style.height = size + 'px';
	element.style.width = size + 'px';
}

function createPixel(pixelSize) {
	const pixel = document.createElement('div');
	setSquaredSize(pixel, pixelSize);
	pixel.classList.add('pixel');
	pixel.addEventListener('click', () => {
		pixel.style.backgroundColor = selectedColor;
	});
	return pixel;
}

function getAlphabetLetter(index) {
	return String.fromCharCode(65 + index);
}

function createPixelsContainer(pixelsContainer, quantityOfPixels, pixelSize) {
	pixelsContainer.innerHTML = '';
	const gridSize = quantityOfPixels * pixelSize;

	const headerRow = document.createElement('div');
	headerRow.classList.add('row');
	headerRow.style.width = gridSize + pixelSize + 'px';

	const emptyCorner = document.createElement('div');
	setSquaredSize(emptyCorner, pixelSize);
	emptyCorner.classList.add('header-cell');
	headerRow.appendChild(emptyCorner);

	for (let i = 0; i < quantityOfPixels; i++) {
		const headerCell = document.createElement('div');
		headerCell.classList.add('header-cell');
		headerCell.textContent = i + 1;
		setSquaredSize(headerCell, pixelSize);
		headerRow.appendChild(headerCell);
	}

	pixelsContainer.appendChild(headerRow);

	for (let rowIndex = 0; rowIndex < quantityOfPixels; rowIndex++) {
		const row = document.createElement('div');
		row.classList.add('row');
		row.style.width = gridSize + pixelSize + 'px';

		const rowHeader = document.createElement('div');
		rowHeader.classList.add('header-cell');
		rowHeader.textContent = getAlphabetLetter(rowIndex);
		setSquaredSize(rowHeader, pixelSize);
		row.appendChild(rowHeader);

		for (let columnIndex = 0; columnIndex < quantityOfPixels; columnIndex++) {
			const pixel = createPixel(pixelSize);

			const distanceToTop = rowIndex;
			const distanceToBottom = quantityOfPixels - 1 - rowIndex;
			const distanceToLeft = columnIndex;
			const distanceToRight = quantityOfPixels - 1 - columnIndex;

			const minDistanceToBorder = Math.min(distanceToTop, distanceToBottom, distanceToLeft, distanceToRight);

			if (minDistanceToBorder === 0) {
				pixel.textContent = '1';
			} else if (minDistanceToBorder === 1) {
				pixel.textContent = '2';
			} else if (minDistanceToBorder === 2) {
				pixel.textContent = '3';
			}

			if (pixel.textContent) {
				pixel.style.display = 'flex';
				pixel.style.alignItems = 'center';
				pixel.style.justifyContent = 'center';
				pixel.style.fontSize = Math.floor(pixelSize * 0.6) + 'px';
				pixel.style.color = '#000000';
			}

			if (!gridVisible) pixel.classList.add('no-border');
			row.appendChild(pixel);
		}

		pixelsContainer.appendChild(row);
	}
}

function createColorPickerContainer(colorPickerContainer, colors) {
	for (const colorName in colors) {
		const colorPick = document.createElement('div');
		setSquaredSize(colorPick, 20);
		colorPick.style.backgroundColor = colors[colorName];
		colorPick.classList.add('color-pick');

		colorPick.addEventListener('click', () => {
			selectedColor = colors[colorName];

			document.querySelectorAll('.color-pick').forEach(el => {
				el.classList.remove('selected-color');
			});

			colorPick.classList.add('selected-color');
		});

		colorPickerContainer.appendChild(colorPick);
	}
}

function refreshPixelsContainer() {
	pixelsContainer.innerHTML = '';
	createPixelsContainer(pixelsContainer, quantityOfPixels, pixelSize);
}

window.addEventListener('load', () => {
	createColorPickerContainer(colorPickerContainer, colors);

	createPixelsContainer(pixelsContainer, quantityOfPixels, pixelSize);

	const selectedColorElement = document.querySelector(`.color-pick[style="background-color: ${selectedColor};"]`);
	if (selectedColorElement) {
		selectedColorElement.classList.add('selected-color');
	}
});

/* Количество ячеек */

quantityOfPixelsInput.addEventListener('change', e => {
	const inputValue = parseInt(e.target.value);

	if (inputValue > 26) {
		quantityOfPixelsInput.value = 26;
		quantityOfPixels = 26;
	} else {
		quantityOfPixels = inputValue;
	}

	refreshPixelsContainer();
});

/* Размер ячеек */

sizeOfPixelInput.addEventListener('change', e => {
	inputValue = parseInt(e.target.value);

	if (inputValue < 20) {
		sizeOfPixelInput.value = 20;
		pixelSize = 20;
	} else {
		pixelSize = inputValue;
	}

	refreshPixelsContainer();
});

/* Очистка сетки */

function clearPixels() {
	const pixels = document.querySelectorAll('.pixel');
	pixels.forEach(pixel => (pixel.style.backgroundColor = ''));
}

clearButton.addEventListener('click', clearPixels);

/* Удаление сетки */

function toggleGrid() {
	gridVisible = !gridVisible;
	const pixels = document.querySelectorAll('.pixel');
	pixels.forEach(pixel => (gridVisible ? pixel.classList.remove('no-border') : pixel.classList.add('no-border')));
}

gridToggleButton.addEventListener('click', toggleGrid);

/* Сохранение изображения */

const saveButton = document.getElementById('save-button');

function saveAsPng() {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const gridSize = quantityOfPixels * pixelSize;
	canvas.width = gridSize;
	canvas.height = gridSize;

	const rows = pixelsContainer.querySelectorAll('.row');
	rows.forEach((row, rowIndex) => {
		const pixels = row.querySelectorAll('.pixel');

		pixels.forEach((pixel, colIndex) => {
			const color = window.getComputedStyle(pixel).backgroundColor;
			context.fillStyle = color === 'rgba(0, 0, 0, 0)' ? '#ffffff' : color;
			context.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize);
		});
	});

	const link = document.createElement('a');
	link.download = 'pixel-art.png';
	link.href = canvas.toDataURL('image/png');
	link.click();
}

saveButton.addEventListener('click', saveAsPng);
