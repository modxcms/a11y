# Vertical Navigation

Transforms MODX Revolution west region (left navigation) into an accessible vertical navigation.
Works well with "Tree Menu" component (to add extra menu records).


## Requirements

* MODX Revolution 2.3+

Note : the component might not work with custom manager themes overriding `MODx.Layout#getWest`, `MODx.Layout#getLeftBar` or `MODx.Layout#addToLeftBar`, since those methods are overrided to handle vertical menu entries.


## DOM structure & technical details

By using Vertical Navigation, the west region is transformed and no more makes use of tabs.
The main container become an `ul`, with nested "menu entries" as `li.x-panel.menu-section`

Each "menu entry" (previously tab) is an `MODx.menuEntry` instance (`Ext.Panel` derivative).
The panel title is used to display the container label (ie. Resources, Elements, Files...).

The DOM structure is :

* `div#modx-leftbar` (whole west region)
    * `div.x-plain-bwrap` (west region wrapper)
        * `ul` (all menu entries container)
            * `li.x-panel.menu-section` (menu entry container)
                * `a.x-panel-header` (title container)
                    * `span.x-panel-header-text` (title text wrapper)
                        * `i.icon` (title icon)
                        * `span.title` (title label)
                * `div.x-panel-bwrap` (content wrapper)
                    * `div.x-panel-body` (content container)
