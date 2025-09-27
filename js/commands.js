// Command system for the space cat game
// Handles keyboard input, commands, and player actions

class CommandManager {
    constructor() {
        this.keys = {};
        this.commands = {
            'ArrowUp': 'thrust',
            'ArrowDown': 'brake',
            'ArrowLeft': 'rotateLeft',
            'ArrowRight': 'rotateRight',
            ' ': 'shoot',
            'KeyH': 'heal',
            'KeyE': 'escape',
            'KeyA': 'autopilot',
            'KeyP': 'pause',
            'Backquote': 'console'
        };
        this.consoleVisible = false;
        this.consoleHistory = [];
        this.consoleIndex = -1;
        this.game = null;
    }

    // Initialize event listeners
    init(game) {
        this.game = game;
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.setupConsole();
    }

    // Setup command console
    setupConsole() {
        const consoleInput = document.getElementById('console-input');
        const consoleToggle = document.getElementById('console-toggle');
        const consoleOutput = document.getElementById('console-output');
        
        if (consoleInput) {
            consoleInput.addEventListener('keydown', (e) => this.handleConsoleInput(e));
        }
        
        if (consoleToggle) {
            consoleToggle.addEventListener('click', () => this.toggleConsole());
        }
    }

    // Handle key press
    handleKeyDown(event) {
        // Don't process game commands if console is visible
        if (this.consoleVisible && event.code !== 'Escape') {
            return;
        }
        
        this.keys[event.code] = true;
        const command = this.commands[event.code];
        if (command) {
            this.executeCommand(command);
        }
    }

    // Handle key release
    handleKeyUp(event) {
        this.keys[event.code] = false;
    }

    // Execute a command
    executeCommand(command) {
        switch (command) {
            case 'thrust':
                this.thrust();
                break;
            case 'brake':
                this.brake();
                break;
            case 'rotateLeft':
                this.rotateLeft();
                break;
            case 'rotateRight':
                this.rotateRight();
                break;
            case 'shoot':
                this.shoot();
                break;
            case 'heal':
                this.heal();
                break;
            case 'escape':
                this.escape();
                break;
            case 'autopilot':
                this.toggleAutopilot();
                break;
            case 'pause':
                this.pause();
                break;
            case 'console':
                this.toggleConsole();
                break;
        }
    }

    // Command implementations
    thrust() {
        if (this.game && this.game.spacecraft) {
            this.game.spacecraft.applyThrust(1.0);
            this.addConsoleMessage('🚀 Thrusting forward!');
        }
    }

    brake() {
        if (this.game && this.game.spacecraft) {
            this.game.spacecraft.applyBrake();
            this.addConsoleMessage('🛑 Applying brakes!');
        }
    }

    rotateLeft() {
        if (this.game && this.game.spacecraft) {
            this.game.spacecraft.rotate(-5);
            this.addConsoleMessage('↩️ Rotating left!');
        }
    }

    rotateRight() {
        if (this.game && this.game.spacecraft) {
            this.game.spacecraft.rotate(5);
            this.addConsoleMessage('↪️ Rotating right!');
        }
    }

    shoot() {
        if (this.game && this.game.spacecraft) {
            const shot = this.game.spacecraft.fireWeapon();
            if (shot) {
                this.addConsoleMessage('💥 Strong Gun fired! (1-shot asteroid destruction)');
            } else {
                this.addConsoleMessage('⚠️ Weapons offline or insufficient energy!');
            }
        }
    }

    heal() {
        if (this.game && this.game.spacecraft) {
            const used = this.game.spacecraft.usePurrCharge();
            if (used) {
                this.addConsoleMessage('💊 PurrCharge used! (+25 energy)');
            } else {
                this.addConsoleMessage('⚠️ No PurrCharges remaining!');
            }
        }
    }

    escape() {
        if (this.game && this.game.spacecraft) {
            const ejected = this.game.spacecraft.activateEscapePod();
            if (ejected) {
                this.addConsoleMessage('🚀 Escape pod activated!');
            } else {
                this.addConsoleMessage('⚠️ Escape pod not available!');
            }
        }
    }

    toggleAutopilot() {
        if (this.game && this.game.spacecraft) {
            this.game.spacecraft.toggleAutopilot();
            const status = this.game.spacecraft.state.autopilotActive ? 'ON' : 'OFF';
            this.addConsoleMessage(`🎯 Autopilot ${status} (1%/s energy use)`);
        }
    }

    pause() {
        if (this.game) {
            this.game.togglePause();
            this.addConsoleMessage('⏸️ Game paused/resumed');
        }
    }

    // Console functionality
    toggleConsole() {
        const console = document.getElementById('command-console');
        const input = document.getElementById('console-input');
        
        if (console) {
            this.consoleVisible = !this.consoleVisible;
            console.style.display = this.consoleVisible ? 'block' : 'none';
            
            if (this.consoleVisible && input) {
                input.focus();
            }
        }
    }

    handleConsoleInput(event) {
        if (event.key === 'Enter') {
            const input = event.target;
            const command = input.value.trim().toLowerCase();
            
            if (command) {
                this.consoleHistory.unshift(command);
                this.consoleIndex = -1;
                this.executeConsoleCommand(command);
                input.value = '';
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (this.consoleIndex < this.consoleHistory.length - 1) {
                this.consoleIndex++;
                event.target.value = this.consoleHistory[this.consoleIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (this.consoleIndex > 0) {
                this.consoleIndex--;
                event.target.value = this.consoleHistory[this.consoleIndex];
            } else {
                event.target.value = '';
                this.consoleIndex = -1;
            }
        } else if (event.key === 'Escape') {
            this.toggleConsole();
        }
    }

    executeConsoleCommand(command) {
        switch (command) {
            case 'help':
                this.addConsoleMessage('Available commands:');
                this.addConsoleMessage('  help - Show this help');
                this.addConsoleMessage('  status - Show spacecraft status');
                this.addConsoleMessage('  autopilot - Toggle autopilot');
                this.addConsoleMessage('  purr - Use PurrCharge');
                this.addConsoleMessage('  eject - Activate escape pod');
                this.addConsoleMessage('  weapons - Toggle weapons');
                break;
            case 'status':
                if (this.game && this.game.spacecraft) {
                    const status = this.game.spacecraft.getStatus();
                    this.addConsoleMessage(`Hull: ${status.health}/${status.maxHealth}`);
                    this.addConsoleMessage(`Energy: ${status.energy}%`);
                    this.addConsoleMessage(`PurrCharges: ${status.purrCharges}/4`);
                    this.addConsoleMessage(`Autopilot: ${status.autopilotActive ? 'ON' : 'OFF'}`);
                    this.addConsoleMessage(`Weapons: ${status.weaponsOnline ? 'ONLINE' : 'OFFLINE'}`);
                }
                break;
            case 'autopilot':
                this.toggleAutopilot();
                break;
            case 'purr':
                this.heal();
                break;
            case 'eject':
                this.escape();
                break;
            case 'weapons':
                if (this.game && this.game.spacecraft) {
                    this.game.spacecraft.toggleWeapons();
                    const status = this.game.spacecraft.state.weaponsOnline ? 'ONLINE' : 'OFFLINE';
                    this.addConsoleMessage(`🔫 Weapons ${status}`);
                }
                break;
            default:
                this.addConsoleMessage(`Unknown command: ${command}. Type 'help' for available commands.`);
        }
    }

    addConsoleMessage(message) {
        const output = document.getElementById('console-output');
        if (output) {
            const line = document.createElement('div');
            line.className = 'console-line';
            line.textContent = message;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandManager;
}
