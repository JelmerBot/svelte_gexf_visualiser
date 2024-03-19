<script>
  import { onMount } from "svelte";
  import Graph from "graphology";
  import gexf from "graphology-gexf";

  import Menu from "./Menu.svelte";
  import Network from "./Network.svelte";
  import Legends from "./Legends.svelte";

  let files = [];
  let network = null;
  $: loadNetwork(files);

  function loadNetwork(files) {
    const file = files[0];
    if (!file) {
      network = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      network = gexf.parse(Graph, contents);
    };
    reader.readAsText(file);
  }

  // --- Mapping
  let nodeColorMapping;
  let nodeSizeMapping;
  let edgeMapping;
  let viewScale = 1;
</script>

<main>
  <div><input bind:files type="file" id="file-input" /></div>
  <div id="view">
    {#if (console.log(network), network)}
      <Network
        {network}
        {nodeColorMapping}
        {nodeSizeMapping}
        {edgeMapping}
        bind:viewScale
      />
      <Menu
        {network}
        bind:nodeColorMapping
        bind:nodeSizeMapping
        bind:edgeMapping
      />
      <Legends {nodeColorMapping} {nodeSizeMapping} {viewScale} />
    {/if}
  </div>
</main>

<style>
  #view {
    border: 1px solid black;
    position: relative;
  }
</style>
