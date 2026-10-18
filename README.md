# UInWeb

UInWeb is a minimalist library for developing user interfaces in the browser that feel similar to desktop applications.

## Installation

Simply add the following links to the <head></head> of your HTML page:

<link rel="stylesheet" href="UInWeb.css"/>
<script src="UInWeb.js"></script>

Open the 'demo.html' file to see a demonstration run.

## Windows

UInWeb simulates a retro-looking desktop, the root element is a layer with the .desktop class.

<div class="desktop">
</div>

Windows can be added inside this class, which is done with a layer having the .window class.

<div id="the-app" class="window closed"></div>

The .window class can be accompanied by:

- `.opened`, if we want the window to appear open.
- `.closed`, the window appears closed.
- `.maximized`, the window will be maximized.
- `.locked`, the window will be locked for use.
- `.dialog`, a window that cannot be resized.

Windows can contain:

- A title bar, in the form:

    <div class="title-bar">
        <div class="title-bar-icon ">
            <!-- this is the window icon -->
        </div>          
        <div class="caption">
            <!-- this is the window title -->
        </div>
        <div class="title-bar-button maximize">
            <!-- this is a button to maximize the window. -->
        </div>
        <div class="title-bar-button minimize">
            <!-- this is a button to minimize the window. -->
        </div>            
        <div class="title-bar-button close">
            <!-- this is a button to close the window. -->
        </div>
    </div>

- Below the title bar, the menu bar can be placed, in the form:

    <div class="menu-bar">
        <div class="menu-option">
            <!-- option label -->
            <div class="menu-box">
                <div id="show-devs" class="menu-option">
                    <!-- this is a submenu -->
                </div>
            </div>        
        </div>
        <div class="menu-option right">
            <!-- right-aligned option label -->
        </div>                      
    </div>    

- Below the title bar, the client area must necessarily appear:

    <div class="client-area"></div>    

- Finally, we can have the status bar, in the form:

    <div class="status-bar">
        <div class="status-bar-message">
            <!-- Status message -->
        </div>
        <div class="status-bar-progess">
          <span class="progess-text" style="--progress: /* progress percentage */;">
            <!-- Progress percentage -->
          </span>
        </div>
    </div>    

## Client Area

This is where the window content goes. You can freely put HTML or more windows. We have the following elements:

- Layers with `.window`, as discussed in the previous section.
- Layers with `.layout`, which are templates to distribute components over the area, in the form:

    <div class="layout">
        <!-- Components are centered in the area -->
        <div class="layout-vertical">   
            <!-- Each of the rows into which we divide the area -->                 
            <div class="layout-horizontal">
                <!-- Each of the columns into which we divide the area >
            </div>
        </div>
    </div>


- Layers with `.popups`, this layer floats over the client area and is used so that any `.window` layers placed inside it are always on top.

    <div class="popups"></div>

## Desktop

As previously mentioned, `.desktop` is the root element where `.window` layers are placed. In addition to having windows on it, you can have an app bar (`.desktop-bar`) as follows:

    <div class="desktop-bar">
        <div class="desktop-bar-shortcut" target="the-app">
            <div class="desktop-bar-shortcut-icon">                              
                App icon
            </div>            
            <div class="desktop-bar-shortcut-label">
                The app
            </div>
        </div>
    </div>    

Shortcuts to apps/windows appear inside the taskbar; these are layers with `.desktop-bar-shortcut`. We have the `target` attribute, which is the ID of the window linked to the shortcut. If we click on a shortcut, we will open its associated window.

## Widgets

Widgets are custom components; they are layers with the `.widget` class. To add these components, you must include a script that listens for the 'widget' event, which triggers when an element with `.widget` appears in the DOM. For example:

document.addEventListener('widget', (e) => {
    /* we will have the widget in e.target */
})

## Helpers

We have some helpers in JS, which are:

    - UInWeb_openWindow(id): Opens a window given its ID.
    - UInWeb_closeWindow(id): Closes a window given its ID.
    - UInWeb_toggleWindow(id): Opens a window if it is closed, or closes it if it is open, given its ID.
    - UInWeb_isWindowOpened(id): Returns true if a window (given its ID) is open; otherwise, it returns false.
    - UInWeb_isWindowClosed(id): Returns true if a window (given its ID) is closed; otherwise, it returns false.
    - UInWeb_lockWindow(id): Locks a window given its ID.
    - UInWeb_unlockWindow(id): Unlocks a window given its ID.
    - UInWeb_setProgressBar(id, message = null, progress = null): Sets the status bar of a window given its ID.