import { applyOpacity } from "../menu/color.js";
import { rgb } from "d3-color";

// --- Drawing functions
export function draw({
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
}) {
  clear(canvas, ctx);
  translate(canvas, ctx, transform);
  drawEdges(ctx, edges, edgeMapping, xscale, yscale);
  drawNodes(ctx, nodes, nodeColorMapping, nodeSizeMapping, xscale, yscale);
}

// --- Helpers
function translate(canvas, ctx, transform) {
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.k, transform.k);
}

function clear(canvas, ctx) {
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawNodes(
  ctx,
  nodes,
  nodeColorMapping,
  nodeSizeMapping,
  xscale,
  yscale
) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;
  nodes.forEach((node) => {
    ctx.fillStyle = nodeColorMapping.color(node);
    ctx.beginPath();
    ctx.arc(
      xscale(node.x),
      yscale(node.y),
      nodeSizeMapping.size(node),
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();
  });
}

function drawEdges(ctx, edges, edgeMapping, xscale, yscale) {
  ctx.strokeStyle = edgeMapping.color;
  ctx.lineWidth = edgeMapping.width;
  ctx.beginPath();
  edges.forEach((e) => {
    const source = e.source.attributes;
    const target = e.target.attributes;
    ctx.moveTo(xscale(source.x), yscale(source.y));
    ctx.lineTo(xscale(target.x), yscale(target.y));
  });
  ctx.stroke();
}
