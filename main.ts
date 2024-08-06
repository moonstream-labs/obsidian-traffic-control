import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface TrafficLightSettings {
	active: boolean;
}

const DEFAULT_SETTINGS: TrafficLightSettings = {
	active: false,
};

export default class TrafficControl extends Plugin {
	settings: TrafficLightSettings;

	async hideTrafficLights() {
		const tabHeader = document.querySelector(
			".mod-top-left-space .workspace-tab-header-container",
		);

		window
			.require("electron")
			.remote.getCurrentWindow()
			.setWindowButtonVisibility(false);
		if (tabHeader && !tabHeader.classList.contains("traffic-control")) {
			tabHeader.classList.add("traffic-control");
		}
		this.settings.active = true;
		await this.saveSettings();
	}

	async showTrafficLights() {
		const tabHeader = document.querySelector(
			".mod-top-left-space .workspace-tab-header-container",
		);

		window
			.require("electron")
			.remote.getCurrentWindow()
			.setWindowButtonVisibility(true);
		if (tabHeader?.classList.contains("traffic-control")) {
			tabHeader.classList.remove("traffic-control");
		}
		this.settings.active = false;
		await this.saveSettings();
	}

	async onload() {
		console.log("Loading 🚥 Traffic Control");
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TrafficLightSettingTab(this.app, this));

		this.loadRules();

		const classCheck = () => {
			const leftSidebar = document.querySelector(".mod-left-split");
			if (leftSidebar) {
				const containerEl = leftSidebar.querySelector(
					".workspace-tab-header-container",
				);
				if (containerEl) {
					if (this.settings.active) {
						containerEl.classList.add("traffic-control");
					}
				}
			}
		};

		this.app.workspace.onLayoutReady(() => {
			classCheck();
		});

		if (this.settings.active) {
			await this.hideTrafficLights();
		}

		this.addCommand({
			id: "show-traffic-lights",
			name: "Show",
			checkCallback: (checking: boolean) => {
				if (this.settings.active) {
					if (!checking) {
						this.showTrafficLights();
					}
					return true;
				}
			},
		});

		this.addCommand({
			id: "hide-traffic-lights",
			name: "Hide",
			checkCallback: (checking: boolean) => {
				if (!this.settings.active) {
					if (!checking) {
						this.hideTrafficLights();
					}
					return true;
				}
			},
		});
	}

	async onunload() {
		console.log("Unloading 🚥 Traffic Control");
		this.unloadRules();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// add the styling elements we need
	loadRules() {
		// add a css block for our settings-dependent styles
		const css = document.createElement("style");
		css.id = "traffic-control";
		document.getElementsByTagName("head")[0].appendChild(css);

		// add the main class
		document.body.classList.add("traffic-control");
	}

	unloadRules() {
		if (this.settings.active) {
			this.showTrafficLights();
		}

		const styleElement = document.getElementById("traffic-control");
		if (styleElement) {
			styleElement.parentNode?.removeChild(styleElement);
		}
		document.body.classList.remove("traffic-control");
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
					if (!value) {
						this.plugin.showTrafficLights();
					} else {
						this.plugin.hideTrafficLights();
					}
				}),
			);
	}
}
