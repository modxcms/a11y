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
            ,href: 'javascript:void(0);'
            ,tabindex: -1
            //,'data-qtip': 'Test'
            ,title: config.description || ''
        }
        ,headerCssClass: 'x-panel-header'
        ,stateEvents: ['collapse', 'expand']
    });
    MODx.menuEntry.superclass.constructor.call(this, config);
    this.on('afterrender', this.onAfterRender, this);
    return this;
};
Ext.extend(MODx.menuEntry, Ext.Panel, {
    onCollapse : function(doAnim, animArg) {
        MODx.menuEntry.superclass.onCollapse.call(this, doAnim, animArg);
        // Force layout to have no active item
        this.getLayout().setActiveItem(null);
        MODx.a11y.ARIA.setProperty(this.getEl().id, 'tabindex', -1);
        MODx.a11y.ARIA.setProperty(this.getEl().id, 'aria-expanded', false);
    }
    ,onExpand: function(doAnim, animArg) {
        MODx.menuEntry.superclass.onExpand.call(this, doAnim, animArg);
        // Force layout to display its item
        this.getLayout().setActiveItem(0);
        MODx.a11y.ARIA.setProperty(this.getEl().id, 'tabindex', 0);
        MODx.a11y.ARIA.setProperty(this.getEl().id, 'aria-expanded', true);
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
            MODx.a11y.ARIA.setProperty(me.getEl().id, 'tabindex', -1);
            MODx.a11y.ARIA.setProperty(this.getEl().id, 'aria-expanded', true);
        } else {
            MODx.a11y.ARIA.setProperty(me.getEl().id, 'tabindex', 0);
            MODx.a11y.ARIA.setProperty(this.getEl().id, 'aria-expanded', false);
        }
    }
});
Ext.reg('modx-menu-entry', MODx.menuEntry);

MODx.Layout.Default = function(config, getStore) {
    config = config || {};
    Ext.applyIf(config,{
	});

    MODx.Layout.Default.superclass.constructor.call(this, config);
    return this;
};
Ext.extend(MODx.Layout.Default, MODx.Layout, {
    getWest: function(config) {
        var items = [];

        if (MODx.perm.resource_tree) {
            items.push(this.handleRecord({
                title: _('resources')
                ,titleTpl: '<h2><i class="icon icon-sitemap"></i><span class="title">{title}</span></h2>'
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
                ,titleTpl: '<h2><i class="icon icon-bars"></i><span class="title">{title}</span></h2>'
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
                ,titleTpl: '<h2><i class="icon icon-folder-open"></i><span class="title">{title}</span></h2>'
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
                window.open("/manager/?a=resource/create",'_self');
                //var t = Ext.getCmp('modx-resource-tree');
                //if (t) { t.quickCreate(document,{},'modDocument','web',0); }
            }
            ,stopEvent: true
        });
        //expand all resources
        k.addBinding({
            key: Ext.EventObject.ONE
            ,ctrl: true
            ,shift: true
            ,fn: function() {
	        	var t = Ext.getCmp('modx-resource-tree');
	        	t.expandAll();
	        }
            ,stopEvent: true
        });
        //collapse all resources
        k.addBinding({
            key: Ext.EventObject.ONE
            ,ctrl: true
            ,option: true
            ,fn: function() {
	        	var t = Ext.getCmp('modx-resource-tree');
	        	t.collapseAll();
	        }
            ,stopEvent: true
        });
        //expand all elements
        k.addBinding({
            key: Ext.EventObject.TWO
            ,ctrl: true
            ,shift: true
            ,fn: function() {
	        	var t = Ext.getCmp('modx-tree-element');
	        	t.expandAll();
	        }
            ,stopEvent: true
        });
        //collapse all elements
        k.addBinding({
            key: Ext.EventObject.TWO
            ,ctrl: true
            ,option: true
            ,fn: function() {
	        	var t = Ext.getCmp('modx-tree-element');
	        	t.collapseAll();
	        }
            ,stopEvent: true
        });
            
        k.addBinding({
            key: Ext.EventObject.T
            ,ctrl: true
            ,shift: true
            ,fn: function() {
            	//alert("pressed R.");
            	var t = Ext.getCmp('modx-resource-tree');
            	//console.log(t); // M…x.t…e.Resource {0: "/root", 1: "/root/web_0", config: Object, initialConfig: Object, xtype: "modx-tree-resource", id: "modx-resource-tree", remoteToolbar: false…}
            	//t.collapseAll(); //works
            	console.log(t.root); //Ext.t…e.AsyncTreeNode {loaded: true, loading: false, childrenRendered: true, rendered: true, attributes: Object…}
            						// UI > ctNode = div.x-tree-root-node
            	t.root.reload();
            	//t.root.expand(); //nothing
            	//console.log(t.root.childNodes); //web_0
            	//t.root.childNodes.expand(); //not a function
            	//t.expandAll(); //works but is all children
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
     * Format a single menu entry to fit the styling
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
