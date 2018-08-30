const Color = {
  red: '#FF0000',
  blue: '#0000FF',
  black: '#000',
  white: '#FFF',
};

function Graph(canvasId = 'myCanvas') {
  this.c = document.getElementById(canvasId);
  this.ctx = this.c.getContext('2d');

  this.clear = function () {
    this.ctx.fillStyle = Color.red;
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
  }

  this.drawLine = function (x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    this.ctx.closePath();
  }

  this.drawString = function (text, x, y, align = 'center') {
    this.ctx.beginPath();

    this.ctx.textAlign = align;
    this.ctx.font = '9px Arial';
    this.ctx.fillText(text, x, y);

    this.ctx.closePath();
  }
}

function SignalGraph(colors = []) {
  // Attributes
  this.signals = [];
  this.colorPalette = colors;

  this.top = 40;
  
  this.xBase = 30;
  this.xAxis = 360;

  this.yScale = 50;
  this.yBase = this.top + this.yScale * 3;

  // Methods
  this.initialize = function () {
    this.signals = [];

    this.graph = new Graph();
    this.drawAxis();
  }

  this.drawAxis = function() {
    // Draw the axis
    this.graph.clear();

    this.graph.drawLine(this.xBase, this.top, this.xBase, this.top + 2 * this.yScale * 3, Color.black);
    this.graph.drawLine(this.xBase, this.yBase, this.xBase + this.xAxis, this.yBase, Color.black);

    // @TODO: Do not use magic numbers!!!
    for (let k = 0; k <= 6; k++) {
      // x-axis labels
      this.graph.drawLine(this.xBase, this.top + k * this.yScale, this.xBase - 5, this.top + k * this.yScale, Color.blue);
      this.graph.drawString(3 - k, this.xBase - 10, 3 + this.top + k * this.yScale, "right");
    }

    for (let k = 0; k <= 360; k += 90) {
      this.graph.drawLine(this.xBase + k, this.yBase - 4, this.xBase + k, this.yBase + 4, Color.blue);
      this.graph.drawString(k, this.xBase + k - 4, this.yBase + 15);
    }
  }

  this.newSignal = function (data, id) {
    const color = this.colorPalette[this.signals.length % this.colorPalette.length];
    this.signals.push({ ...data, id, color });

    this.plotSignal({ ...data, color });
    return data;
  }

  this.plotSignal = function(data) {
    let { amplitude, frequency, phase, fcomponents, color } = data;

    let oldX = this.xBase;
    let oldY = -1;

    for (let i = 0; i < this.xAxis; i++) {
      let sum = 0;
      let x = this.xBase + i;

      if (fcomponents === 0) {
        sum = Math.sin(toRadians(i) * frequency + toRadians(phase));
      } else {
        for (let k = 1; k < fcomponents; k += 2) {
          sum += Math.sin(toRadians(i) * frequency * k + toRadians(phase)) / k;
        }
      }

      let y = this.yBase - (sum * this.yScale * amplitude);

      if (oldY === -1) {
        this.graph.drawLine(oldX, y, x, y, color);
      } else {
        this.graph.drawLine(oldX, oldY, x, y, color);
      }

      oldX = x;
      oldY = y;
    }
  }

  this.removeSignal = function(id) {
    this.signals = this.signals.filter(signal => signal.id !== id);
  }

  this.repaint = function() {
    this.drawAxis();
    this.signals.forEach(signal => this.plotSignal(signal));
  }

  this.highlightSignal = function(id, color = '#ffff00') {
    this.drawAxis();
    this.signals.forEach(signal => signal.id === id ? this.plotSignal({ ...signal, color }) : this.plotSignal(signal));
  }

  this.history = function() {
    return this.signals;
  }
}

/**
 * Utility Functions
 */
function toRadians(deg) {
  return (deg * (Math.PI / 180));
}

function uuid() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function renderToTable(signals = []) {
  const table = document.querySelector('#signal_table');

  table.innerHTML = signals.reduce((html, signal) => `
    ${html}
    <tr data-id="${signal.id}">
      <td>${signal.amplitude}</td>
      <td>${signal.frequency}</td>
      <td>${signal.phase}</td>
      <td>${signal.fcomponents}</td>
      <td class="delete_signal">
        <button class="mdl-button mdl-js-button mdl-button--icon" onClick="handleSignalDelete('${signal.id}')">
          <i class="material-icons">delete</i>
        </button>
      </td>
    </tr>
  `, "");
}

/**
 * Web App Logic
 */
const colors = [
  '#1A237E',
  '#b71c1c',
  '#880E4F',
  '#263238',
  '#BF360C',
  '#006064'
];

const signals = new SignalGraph(colors);
signals.initialize();

// Event Handlers
function handleSignalFormSubmit(event) {
  event.preventDefault();

  const data = Array
    .from(event.target.querySelectorAll('.data-input'))
    .reduce((data, input) => ({ ...data, [input.id]: +input.value }), {});

  signals.newSignal(data, uuid());
  renderToTable(signals.history());
}

function handleClear(event) {
  event.preventDefault();

  signals.initialize();
  renderToTable();
}

function handleSignalHighlight(event) {
  signals.highlightSignal(event.target.parentElement.dataset.id);
}

function handleSignalOut() {
  signals.repaint();
}

function handleSignalDelete(id) {
  signals.removeSignal(id);
  signals.repaint();
  renderToTable(signals.history());
}

// Event Listeners
const signalsForm = document.querySelector('form#signal_graph');
const clearButton = document.querySelector('#clear_plots');
const signalTable = document.querySelector('#signal_table');

signalsForm.addEventListener('submit', handleSignalFormSubmit);
clearButton.addEventListener('click', handleClear);
signalTable.addEventListener('mouseover', handleSignalHighlight);
signalTable.addEventListener('mouseout', handleSignalOut);