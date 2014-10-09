/**
 * Menu entry for the "vertical navigation"
 *
 * @param {Object} config
 * @extends Ext.Panel
 * @xtype modx-menu-entry
 */
MODx.menuEntry = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        collapsible: true
        ,collapsed: true
        ,stateful: true
        ,cls: 'menu-section'
        ,titleCollapse: true
        ,hideCollapseTool: true
        ,layout: {
            type: 'card'
            ,deferredRender: true
        }
        ,autoEl: {
            tag: 'li'
        }
        ,headerCfg: {
            tag: 'a'
            ,href: 'javascript:;'
            ,tabindex: 1
            //,'data-qtip': 'Test'
            ,title: config.description || ''
        }
        ,headerCssClass: 'x-panel-header'
        ,stateEvents: ['collapse', 'expand']
    });
    MODx.menuEntry.superclass.constructor.call(this, config);
    this.on('afterrender', this.onAfterRender, this);
};
Ext.extend(MODx.menuEntry, Ext.Panel, {
    onCollapse : function(doAnim, animArg) {
        MODx.menuEntry.superclass.onCollapse.call(this, doAnim, animArg);
        // Force layout to have no active item
        this.getLayout().setActiveItem(null);
    }
    ,onExpand: function(doAnim, animArg) {
        MODx.menuEntry.superclass.onExpand.call(this, doAnim, animArg);
        // Force layout to display its item
        this.getLayout().setActiveItem(0);
    }
    ,getState: function() {
        // Menu attributes to save/restore for the state manager
        return {
            collapsed: this.collapsed
        };
    }

    ,onAfterRender: function(me) {
        if (!me.collapsed) {
            me.getLayout().setActiveItem(0);
        }
    }
});
Ext.reg('modx-menu-entry', MODx.menuEntry);


// PoC to use border layout
MODx.menuBorder = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        test: true
    });
    MODx.menuBorder.superclass.constructor.call(this, config);
};
Ext.extend(MODx.menuBorder, MODx.menuEntry, {
    onCollapse : function(doAnim, animArg) {
        this.animate('50px');

        MODx.menuEntry.superclass.onCollapse.call(this, doAnim, animArg);

        var center = Ext.getCmp('center-nav');
        //center.hide();
        center.removeAll();

    }
    ,onExpand: function(doAnim, animArg) {
        var center = Ext.getCmp('center-nav');
        center.removeAll();

        // Collapse all expanded
        var nav = Ext.getCmp('nav-one');
        nav.items.each(function(item) {
            if (item.id !== this.id && !item.collapsed && typeof item.collapse === 'function') {
                //console.log('item to be collapsed', item);
                item.collapse();
                //item.fireEvent('collapse');
            }
        }, this);

        center.add(this.initialConfig.items);

        this.animate('230px', true);

        MODx.menuEntry.superclass.onExpand.call(this, doAnim, animArg);
    }

    ,animate: function(width) {
        var west = Ext.getCmp('modx-leftbar-tabs')
            ,center = Ext.getCmp('center-nav');

        west.setWidth(width);

        //west.doLayout();
        Ext.getCmp('modx-layout').doLayout();
    }

    ,onAfterRender: function(me) {
        if (!me.collapsed) {
            me.on('collapse', function(elem) {
                console.log('collapsed, so expand again!');
                elem.expand();
                elem.collapsed = false;
            }, me, {single: true});

            me.collapse();
        }
    }
});
Ext.reg('modx-menu-border-entry', MODx.menuBorder);


// Define the kind of vertical navigation we want to use
MODx.config['vnav.use_border'] = ~~MODx.config['vnav.use_border'] || false;

// Override MODx.Layout to support vertical navigation
Ext.override(MODx.Layout, {

    getWest: function(config) {
        var items = [];

        this.handleLeftScroll();

        if (MODx.perm.resource_tree) {
            items.push(this.handleRecord({
                title: _('resources')
                ,titleTpl: '<i class="icon icon-sitemap"></i><span class="title">{title}</span>'
                ,stateId: 'nav-resource-tree'
                ,defaults: {
                    remoteToolbar: false
                    ,tbar: {
                        hidden: true
                    }
                    ,useDefaultToolbar: false
                }
                ,items: [{
                    xtype: 'modx-tree-resource'
                    ,id: 'modx-resource-tree'
                }]
            }));
            config.showTree = true;
        }
        if (MODx.perm.element_tree) {
            items.push(this.handleRecord({
                title: _('elements')
                ,titleTpl: '<i class="icon icon-bars"></i><span class="title">{title}</span>'
                ,stateId: 'nav-element-tree'
                ,defaults: {
                    remoteToolbar: false
                    ,tbar: {
                        hidden: true
                    }
                    ,useDefaultToolbar: false
                }
                ,items: [{
                    xtype: 'modx-tree-element'
                    ,id: 'modx-tree-element'
                }]
            }));
            config.showTree = true;
        }
        if (MODx.perm.file_tree) {
            items.push(this.handleRecord({
                title: _('files')
                ,titleTpl: '<i class="icon icon-folder-open"></i><span class="title">{title}</span>'
                ,stateId: 'nav-file-tree'
                ,defaults: {
                    remoteToolbar: false
                    ,tbar: {
                        hidden: true
                    }
                    ,useDefaultToolbar: false
                }
                ,items: [{
                    xtype: 'modx-panel-filetree'
                    ,id: 'modx-file-tree'
                }]
            }));
            config.showTree = true;
        }

        var content = {
            region: 'west'
            ,applyTo: 'modx-leftbar'
            ,id: 'modx-leftbar-tabs'
            ,stateId: this.getStateKey('modx-leftbar-tabs')
            ,split: true
            // @TODO : make use of original config (MODx.Layout), requires some PR
            ,width: 310
            ,autoScroll: true
            ,unstyled: true
            ,collapseMode: 'mini'
            ,useSplitTips: true
            ,monitorResize: true
            ,layout: 'anchor'
            ,items: items
            ,defaultType: 'modx-menu-entry'
            ,minSize: 195
            ,bodyCfg: {
                tag: 'ul'
            }
            ,listeners: {
                beforestatesave: this.onBeforeStateSave
                ,scope: this
            }
            ,getState: function() {
                return {
                    collapsed: this.collapsed
                    ,width: this.width
                };
            }
        };

        if (MODx.config['vnav.use_border']) {
            content.listeners.afterrender = this.afterBorderRender;
            Ext.apply(content, {
                minSize: 50
                ,layout: 'border'
                ,defaultType: 'container'
                ,bodyCfg: {
                    tag: 'div'
                    ,cls: 'border-nav'
                }
                ,defaults: {
                    stateful: false
                    //,autoHeight: true
                }
                ,items: [{
                    region: 'west'
                    ,items: items
                    ,defaultType: 'modx-menu-border-entry'
                    ,width: '50px'
                    ,id: 'nav-one'
                    ,itemId: 'main-nav'
                    ,autoEl: {
                        tag: 'ul'
                        ,cls: 'main-nav'
                    }
                },{
                    region: 'center'
                    ,cls: 'x-panel-body sub-nav'
                    ,id: 'center-nav'
                    ,itemId: 'sub-nav'
                }]
            });
        }

        return content;
    }

    ,afterBorderRender: function() {
        Ext.defer(function() {
            //console.log('after border render!');
            Ext.getCmp('modx-layout').doLayout();
        }, 250);
    }

    /**
     * Dirty hack to handle scrollbar in left region
     */
    ,handleLeftScroll: function() {
        var c = Ext.get('modx-leftbar');
        c.on('DOMSubtreeModified', function(vent, elem, options) {
            Ext.defer(function() {
                this.getLeftBar().doLayout();
                // Schedule again
                this.handleLeftScroll();
            }, 150, this);
        }, this, {
            single: true
        });
    }
    /**
     * Wrapper method to get the navigation container
     *
     * @returns {Ext.Panel}
     */
    ,getLeftBar: function() {
        var nav = Ext.getCmp('modx-leftbar-tabs');
        if (MODx.config['vnav.use_border']) {
            nav = nav.getComponent('main-nav');
        }
        if (nav) {
            return nav;
        }
    }
    /**
     * Handle menu entries addition
     *
     * @param {Object|Array} items
     */
    ,addToLeftBar: function(items) {
        var nav = this.getLeftBar();
        if (nav && items) {
            if (Ext.isObject(items)) {
                items = this.handleRecord(items);
            } else {
                Ext.each(items, function(item, idx) {
                    items[idx] = this.handleRecord(item);
                }, this);
            }

            nav.add(items);
            this.onAfterLeftBarAdded(nav, items);
        }
    }

    /**
     * Convenient method to place the given records at the given position
     *
     * @param {Number} index
     * @param {Object|Array} items
     */
    ,addToLeftBarAt: function(index, items) {
        var nav = this.getLeftBar();
        if (nav && items) {

            if (Ext.isObject(items)) {
                items = this.handleRecord(items);
            } else {
                Ext.each(items, function(item, idx) {
                    items[idx] = this.handleRecord(item);
                }, this);
            }

            Ext.each(items, function(item, idx) {
                nav.insert(index, item);
                index += 1;
            }, this);

            this.onAfterLeftBarAdded(nav, items);
        }
    }

    /**
     * Format a single menu entry to fit the stying
     *
     * @param {Object} config
     *
     * @returns {Object}
     */
    ,handleRecord: function(config) {
        if (!config.titleTpl) {
            // Default tpl
            config.titleTpl = '<tpl if="icon"><i class="icon {icon}"></i></tpl><tpl if="title"><span class="title">{title}</span></tpl>';
        }

        if (!config.menuIcon) {
            // Default icon
            config.menuIcon = 'icon-asterisk';
        }

        if (MODx.config['vnav.use_border']) {
            // Border nav
            if (config.title && !config.description) {
                config.description = config.title;
            }
        }

        if (config.title && config.titleTpl) {
            config.title = new Ext.XTemplate(config.titleTpl).apply({
                title: MODx.config['vnav.use_border'] ? '' : config.title
                ,icon: config.menuIcon || ''
                ,description: config.description || ''
            });
        }
        if (config.stateId) {
            config.stateId = this.getStateKey(config.stateId);
        }

        return config;
    }
    /**
     * Compute state keys for Ext.State.Manager, to be theme related
     *
     * @param {String} key
     *
     * @returns {string}
     */
    ,getStateKey: function(key) {
        return 'theme-' + MODx.config.manager_theme + '-' + key;
    }

    /**
     * Force navigation container to be re-rendered after adding some elements in
     *
     * @param {Ext.Panel} nav
     * @param {Object|Array} items
     */
    ,_onAfterLeftBarAdded: function(nav, items) {
        nav.doLayout();
    }

    /**
     * Override to prevent error caused by not existing tab panel
     *
     * @see MODx.Layout#onBeforeStateSave
     *
     * @param {Ext.Component} component
     * @param {Object} state
     */
    ,onBeforeStateSave: function(component, state) {
        return;
        var collapsed = state.collapsed;
        if (collapsed && !this.stateSave) {
            this.stateSave = true;
            return false;
        }
        if (!collapsed) {
            var wrap = Ext.get('modx-leftbar').down('div');
            if (!wrap.isVisible()) {
                // Set the "masking div" to visible
                wrap.setVisible(true);
            }
        }
    }
});
