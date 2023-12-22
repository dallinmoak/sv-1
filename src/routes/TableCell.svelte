<script>
	export let contents;
	export let editing;
</script>

<td>
	{#if editing}
  <input type={contents.type} value={contents.value}/>
  {:else}
  {contents.display(contents.value)}
	{/if}
</td>
