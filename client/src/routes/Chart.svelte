<script>
  import { quantize, interpolatePlasma, pie, arc } from 'd3';

  export let data = [];

  const width = 300; // Outer width of the chart, in pixels
  const height = width; // Outer height of the chart, in pixels
  const outerRadius = Math.min(width, height) / 2; // Outer radius of the circle, in pixels
  const innerRadius = outerRadius * 0.5; // Inner radius of the chart, in pixels
  const labelRadius = outerRadius * 0.8; // Center radius of labels
  const fontSize = 17; // Font size of the x and y values
  const strokeWidth = 0; // Width of stroke separating wedges

  // Custom color for a single category
  const singleCategoryColor = "plum"; // Purple color

  // Color scheme
  let colors;
  if (data.length === 1) {
    colors = [singleCategoryColor];
  } else {
    colors = quantize(t => interpolatePlasma(t * 0.2 + 0.3), data.length);
  }

  console.log(colors);

  // Create the pie layout
  const createPie = pie()
    .value(d => d.amount)
    .sort(null);

  // Create the arc generator for the path
  const arcPath = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  // Create the arc generator for the label
  const arcLabel = arc()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);

  const arcs = createPie(data);
</script>

<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
  <g transform={`translate(${width / 2}, ${height / 2})`}>
    {#each arcs as arc, i (arc.data.category)}
      <path fill={colors[i]} d={arcPath(arc)} stroke={strokeWidth} />
      <text transform={`translate(${arcLabel.centroid(arc)})`} text-anchor="middle" font-size={fontSize}>
        <tspan x="0" dy="0.3em" font-weight="bold">{arc.data.category}</tspan>
        <tspan x="0" dy="1em">${arc.data.amount.toLocaleString()}</tspan>
      </text>
    {/each}
  </g>
</svg>
