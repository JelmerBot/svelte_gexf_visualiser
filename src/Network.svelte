<script>
  import { scaleLinear } from "d3-scale";
  import { select } from "d3-selection";
  import { draw } from "./network/drawing";
  import { extent, median } from "d3-array";
  import { zoom, zoomIdentity } from "./network/zoom";

  // --- Export props
  export let network;
  export let nodeColorMapping;
  export let nodeSizeMapping;
  export let edgeMapping;
  export let viewScale = 1;

  // --- Construct canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 700;

  const nodes = Array.from(network._nodes.values()).map((n) => n.attributes);
  const edges = Array.from(network._edges.values());
  console.log(edges);

  // Scales
  $: ex = extent(nodes, (n) => n.x);
  $: ey = extent(nodes, (n) => n.x);
  $: xscale = scaleLinear()
    .domain(ex)
    .range([5, canvas.width - 5]);
  $: yscale = scaleLinear()
    .domain(ey)
    .range([canvas.height - 5, 5]);

  // --- Zoom interaction
  let transform = { x: 0, y: 0, k: 1, invert: ([x, y]) => [x, y] };
  $: viewScale = transform.k;
  const _zoom = zoom()
    .extent([
      [5, 5],
      [canvas.width - 5, canvas.height - 5],
    ])
    .on("zoom", (event) => (transform = event.transform));

  // --- Event handles action
  function interact(element) {
    function _filter(event) {
      return (!event.ctrlKey || event.type === "wheel") && !event.button;
    }

    function wheeled(event) {
      if (!_filter(event)) {
        return;
      }
      _zoom.wheeled.bind(this)(event);
    }

    function mousedowned(event) {
      if (!_filter(event)) {
        return;
      }
      _zoom.mousedowned.bind(this)(event);
      event.stopImmediatePropagation();
    }

    function dblclicked(event) {
      if (!_filter(event)) {
        return;
      }
      select(this)
        .transition()
        .duration(250)
        .call(_zoom.transform, zoomIdentity);
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    element.appendChild(canvas);
    select(canvas)
      .call(_zoom)
      .on("wheel", wheeled, { passive: false })
      .on("mousedown", mousedowned)
      .on("dblclick", dblclicked);
  }

  // --- Animation
  $: if (edgeMapping) {
    window.requestAnimationFrame(() =>
      draw({
        canvas,
        ctx,
        nodes,
        nodeColorMapping,
        nodeSizeMapping,
        edges,
        edgeMapping,
        transform,
        xscale,
        yscale,
      })
    );
  }
</script>

<div use:interact style="width:{canvas.width}px;" />

<style>
  div {
    background-color: #fff;
  }
</style>
