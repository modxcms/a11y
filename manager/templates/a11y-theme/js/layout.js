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

MODx.Layout.Default = function(config, getStore) {
    config = config || {};

    MODx.Layout.Default.superclass.constructor.call(this, config);
    return this;
};
Ext.extend(MODx.Layout.Default, MODx.Layout, {
    getWest: function(config) {
        var items = [];

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

        return {
            region: 'west'
            ,applyTo: 'modx-leftbar'
            ,id: 'modx-leftbar-tabs'
            ,width: 310
            ,autoScroll: true
            ,unstyled: true
            ,layout: 'anchor'
            ,items: items
            ,defaultType: 'modx-menu-entry'
            ,minSize: 195
            ,bodyCfg: {
                tag: 'ul'
            }
            ,collapsible: false
        };
    }

    // 'Nullification' to prevent left bar collapsing
    ,hideLeftbar: function(anim, state) {}
    ,toggleLeftbar: function() {}
    ,loadKeys: function() {
        Ext.KeyMap.prototype.stopEvent = true;
        var k = new Ext.KeyMap(Ext.get(document));
        // ctrl + shift + h : toggle left bar
        //k.addBinding({
        //    key: Ext.EventObject.H
        //    ,ctrl: true
        //    ,shift: true
        //    ,fn: this.toggleLeftbar
        //    ,scope: this
        //    ,stopEvent: true
        //});
        // ctrl + shift + n : new document
        k.addBinding({
            key: Ext.EventObject.N
            ,ctrl: true
            ,shift: true
            ,fn: function() {
                var t = Ext.getCmp('modx-resource-tree');
                if (t) { t.quickCreate(document,{},'modDocument','web',0); }
            }
            ,stopEvent: true
        });
        // ctrl + shift + u : clear cache
        k.addBinding({
            key: Ext.EventObject.U
            ,ctrl: true
            ,shift: true
            ,alt: false
            ,fn: MODx.clearCache
            ,scope: this
            ,stopEvent: true
        });

        this.fireEvent('loadKeyMap',{
            keymap: k
        });
    }
    /**
     * Wrapper method to get the navigation container
     *
     * @returns {Ext.Panel}
     */
    ,getLeftBar: function() {
        var nav = Ext.getCmp('modx-leftbar-tabs');
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

        if (config.title && config.titleTpl) {
            config.title = new Ext.XTemplate(config.titleTpl).apply({
                title: config.title
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
});
Ext.reg('modx-layout',MODx.Layout.Default);
