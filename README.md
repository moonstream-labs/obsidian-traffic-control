# 🚥 Traffic Control

## Hide/Show native macOS Window Controls in Obsidian

Traffic Control is an [Obsidian](https://obsidian.md) plugin that allows you to hide or show the "traffic light" controls (close, minimize, and maximize buttons) in the macOS version of Obsidian. This plugin gives you more control over your workspace appearance and can be particularly useful for distraction-free writing or when using Obsidian in full-screen mode.

## Features

- 🎛️ Toggle traffic light controls (close, minimize, maximize buttons) visibility
- 🖥️ Works across all open Obsidian windows (and vaults!)
- 🔄 Automatically applies to newly opened windows

## Installation

1. Open Obsidian and go to Settings
2. Set Obsidian window frame style to "Hidden (default)"
3. Navigate to Community Plugins and disable Safe Mode
4. Click on Browse and search for "Traffic Control"
5. Click Install
6. Once installed, enable the plugin
7. Open the command palette (⌘P)
8. Search for "Traffic Control"
9. Apply the "Hide" or "Show" command

## Usage

### Toggle Traffic Lights

You can toggle the visibility of the traffic light controls in several ways:

1. **Using the Command Palette**: 
   - Open the Command Palette (Cmd/Ctrl + P)
   - Type "Traffic Control" and select either "Hide" or "Show"

2. **Using Hotkeys**:
   - Open Settings > Hotkeys
   - Search for "Traffic Control"
   - Assign hotkeys to the "Hide" and "Show" commands

3. **Using the Settings Toggle**:
   - Go to Settings > Community Plugins > Traffic Control
   - Use the toggle switch to hide or show the controls

### Behavior

- The plugin will remember your preference and apply it persistently across all open windows and newly opened windows across all Obsidian windows (including other vaults!).
- Though the plugin will automatically hide/show traffic lights across all open windows/vaults, it is recommended to install a separate copy of the plugin for each vault. 
- When you disable the plugin, it will automatically restore the traffic light controls.

## Compatibility

This plugin is designed for macOS versions of Obsidian. It may not work as intended on Windows or Linux.

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/moonstream-labs/obsidian-traffic-control/issues) on the GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

> [!WARNING]
> This plugin relies heavily on Electron APIs that are otherwise undocumented in the Obsidian API.
> Though everything seems to be working as of 9/7/24, we are still ironing out the kinks!
