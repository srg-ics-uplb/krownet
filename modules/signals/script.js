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
    this.ctx.beginPath();
  }

  this.drawLine = function (x1, y1, x2, y2, color) {
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  this.drawString = function (text, x, y) {
    this.ctx.font = '9px Arial';
    this.ctx.fillText(text, x, y);
  }
}

function SignalGraph() {
  // Attributes
  this.signals = {};

  this.top = 40;
  
  this.xBase = 30;
  this.xAxis = 360;

  this.yScale = 50;
  this.yBase = this.top + this.yScale * 3;

  // Methods
  this.initialize = function () {
    this.signals = {};

    // Draw the axis
    this.graph = new Graph();
    this.graph.clear();

    this.graph.drawLine(
      this.xBase, this.top,
      this.xBase, this.top + 2 * this.yScale * 3,
      Color.black
    );
    this.graph.drawLine(
      this.xBase, this.yBase,
      this.xBase + this.xAxis, this.yBase,
      Color.black
    );

    // @TODO: Do not use magic numbers!!!
    for (let k = 0; k <= 6; k++) {
      // x-axis labels
      this.graph.drawLine(
        this.xBase, this.top + (k * this.yScale),
        this.xBase - 5, this.top + (k * this.yScale),
        Color.blue
      );
      this.graph.drawString(3 - k, this.xBase - 10, 3 + this.top + (k * this.yScale));
    }

    for (let k = 0; k <= 360; k += 90) {
      this.graph.drawLine(
        this.xBase + k, this.yBase - 4,
        this.xBase + k, this.yBase + 4,
        Color.blue
      );
      this.graph.drawString(k, this.xBase + k - 2, this.yBase + 15);
    }
  }

  this.newSignal = function (data) {
    this.signals = { ...this.signals, [uuid()]: data };
    this.plotSignal(data);

    return data;
  }

  this.plotSignal = function(data) {
    let { amplitude, frequency, phase, fcomponents } = data;

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
        this.graph.drawLine(oldX, y, x, y);
      } else {
        this.graph.drawLine(oldX, oldY, x, y);
      }

      oldX = x;
      oldY = y;
    }
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

function renderToTable(data, signals) {
  const table = document.querySelector('#signal_table');

  if (!signals) {
    if (!data) {
      table.innerHTML = '';
    } else {
      const { amplitude, frequency, phase, fcomponents } = data;

      table.innerHTML = `
        ${table.innerHTML}
        <tr>
          <td>${amplitude}</td>
          <td>${frequency}</td>
          <td>${phase}</td>
          <td>${fcomponents}</td>
        </tr>
      `;
    }
  } else {
    table.innerHTML = Object.keys(signals).reduce((html, uuid) => `
      ${html}
      <tr data-id="${uuid}">
        <td>${signals[uuid].amplitude}</td>
        <td>${signals[uuid].frequency}</td>
        <td>${signals[uuid].phase}</td>
        <td>${signals[uuid].fcomponents}</td>
      </tr>
    `, "");
  }
}

/**
 * Web App Logic
 */
const signals = new SignalGraph();
signals.initialize();

// Event Handlers
function handleSignalFormSubmit(event) {
  event.preventDefault();

  const data = Array
    .from(event.target.querySelectorAll('.data-input'))
    .reduce((data, input) => ({ ...data, [input.id]: +input.value }), {});

  signals.newSignal(data);
  renderToTable(data);
}

function handleClear(event) {
  event.preventDefault();

  signals.initialize();
  renderToTable();
}

// Event Listeners
const signalsForm = document.querySelector('form#signal_graph');
const clearButton = document.querySelector('#clear_plots');

signalsForm.addEventListener('submit', handleSignalFormSubmit);
clearButton.addEventListener('click', handleClear);
