// Keeps the state of keys/buttons
//
// You can check
//
//   inputManager.keys.left.down
//
// to see if the left key is currently held down
// and you can check
//
//   inputManager.keys.left.justPressed
//
// To see if the left key was pressed this frame
//
// Keys are 'left', 'right', 'a', 'b', 'up', 'down'
export class InputManager {
	constructor()
	{
		this.keys = {};
		const keyMap = new Map();
   
		const setKey = (keyName, pressed) => 
		{
			const keyState = this.keys[keyName];
			keyState.justPressed = pressed && !keyState.down;
			keyState.down = pressed;
		};
   
		const addKey = (keyCode, name) =>
		{
			this.keys[name] = { down: false, justPressed: false };
			keyMap.set(keyCode, name);
		};
   
	  	const setKeyFromKeyCode = (keyCode, pressed) =>
		{
			const keyName = keyMap.get(keyCode);
			if (!keyName)
			{
				return;
			}
			setKey(keyName, pressed);
		};
	
		addKey('KeyA', 'A');
		addKey('KeyD', 'D');
		addKey('KeyW', 'W');
		addKey('KeyS', 'S');
		addKey('KeyF', 'F');

		window.addEventListener('keydown', (e) => 
		{
		setKeyFromKeyCode(e.code, true);
		});
		window.addEventListener('keyup', (e) =>
		{
			setKeyFromKeyCode(e.code, false);
		});
	}
	update() 
	{
		for (const keyState of Object.values(this.keys))
		{
			if (keyState.justPressed)
			{
				keyState.justPressed = false;
			}
		}
	}
}