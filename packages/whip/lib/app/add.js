export default async function add (...plugins) {
  for (const { plugin, opts } of plugins) {
    // Execute the plugin with the app (this) and any passed options.
    const returned = plugin(this, opts)

    // If the plugin function is a promise, wait for it to resolve.
    if (returned?.then) await returned
  }
}
