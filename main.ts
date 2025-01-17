// main.ts

import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import type { BrowserWindow } from "@electron/remote";

interface TrafficLightSettings {
	active: boolean;
}

const DEFAULT_SETTINGS: TrafficLightSettings = {
	active: false,
};

export default class TrafficControl extends Plugin {
	settings: TrafficLightSettings;
	remote: typeof import("@electron/remote");

	async onload() {
		console.log("Loading 🚥 Traffic Control");
		await this.loadSettings();

		this.remote = window.require("@electron/remote");

		this.addSettingTab(new TrafficLightSettingTab(this.app, this));

		this.addCommand({
			id: "hide-traffic-lights",
			name: "Hide",
			callback: () => this.hideTrafficLights(),
		});

		this.addCommand({
			id: "show-traffic-lights",
			name: "Show",
			callback: () => this.showTrafficLights(),
		});

		this.registerEvent(
			this.app.workspace.on("window-open", (win) => {
				setTimeout(() => this.applyCurrentSetting(), 500);
			}),
		);

		this.loadRules();
		this.applyCurrentSetting();
	}

	async applyClassToAllWindows(addClass: boolean) {
		const allWindows = this.remote.BrowserWindow.getAllWindows();
		for (const window of allWindows) {
			await window.webContents.executeJavaScript(`
				(function() {
					const tabHeader = document.querySelector(".mod-top-left-space .workspace-tab-header-container");
					if (tabHeader) {
						if (${addClass}) {
							if (!tabHeader.classList.contains("traffic-control")) {
								tabHeader.classList.add("traffic-control");
							}
						} else {
							tabHeader.classList.remove("traffic-control");
						}
					}
				})()
			`);
		}
	}

	async hideTrafficLights() {
		const allWindows = this.remote.BrowserWindow.getAllWindows();
		allWindows.forEach((window) => window.setWindowButtonVisibility(false));

		await this.applyClassToAllWindows(true);

		this.settings.active = true;
		await this.saveSettings();
	}

	async showTrafficLights() {
		const allWindows = this.remote.BrowserWindow.getAllWindows();
		allWindows.forEach((window) => window.setWindowButtonVisibility(true));

		await this.applyClassToAllWindows(false);

		this.settings.active = false;
		await this.saveSettings();
	}

	applyCurrentSetting() {
		if (this.settings.active) {
			this.hideTrafficLights();
		} else {
			this.showTrafficLights();
		}
	}

	onunload() {
		console.log("Unloading 🚥 Traffic Control");
		this.showTrafficLights();
		this.unloadRules();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	loadRules() {
		const css = document.createElement("style");
		css.id = "traffic-control";
		document.getElementsByTagName("head")[0].appendChild(css);
		document.body.classList.add("traffic-control");
	}

	async unloadRules() {
		if (this.settings.active) {
			await this.showTrafficLights();
		}

		const allWindows = this.remote.BrowserWindow.getAllWindows();
		for (const window of allWindows) {
			await window.webContents.executeJavaScript(`
				(function() {
					const styleElement = document.getElementById("traffic-control");
					if (styleElement) {
						styleElement.parentNode.removeChild(styleElement);
					}
					document.body.classList.remove("traffic-control");
				})()
			`);
		}
	}
}

class TrafficLightSettingTab extends PluginSettingTab {
	plugin: TrafficControl;

	constructor(app: App, plugin: TrafficControl) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("🚥 Traffic Control")
			.setDesc("Show/Hide Native macOS Window Controls")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.active).onChange(async (value) => {
					if (value) {
						await this.plugin.hideTrafficLights();
					} else {
						await this.plugin.showTrafficLights();
					}
				}),
			);
	}
}
