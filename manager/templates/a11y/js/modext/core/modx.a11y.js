Ext.namespace('MODx.a11y');

function uberBarMovement(key,el,elp) {

	   	//console.log("keycode: "+key);
	    //console.log("elp: "+elp);
	    //console.log("el: "+el);

		if(elp == "limenu-site" || elp == "limenu-media" || elp == "limenu-components" || elp == "limenu-manage" || elp == "limenu-user" || elp == "limenu-admin" || elp == "limenu-about"){

			//its a main dropdown

		    var subNavEl = Ext.get(elp).select('.modx-subnav');
			var rootItem = subNavEl.item(0);

			if(key == 40){ //down
				if( rootItem.isVisible() ){
					//console.log("subnav already has class .open");
				} else {
					rootItem.addClass('open');
					Ext.each(rootItem.query("li"), function(item,idx){
			            item.setAttribute('tabindex', "-1");
			            if(idx==0){item.focus();}
			        });
				}
			}

			if(key == 39){ //right
				if(rootItem){ rootItem.removeClass('open'); }
				//clear all child tabindexes
				Ext.each(Ext.get('modx-topnav').query('.modx-subnav li'), function(item,idx){
			        item.removeAttribute('tabindex');
			    });
			    var nextLi = Ext.get(elp).next('li');
			    if(nextLi){
			        var nextLichild = nextLi.dom.childNodes[1];
			        nextLichild.focus();
			    } else {
			        //it might be "manage" or "help"
			        if(elp == "limenu-manage"){var userLi = Ext.get("limenu-user");  userLi.dom.childNodes[1].focus();}
			        if(elp == "limenu-about"){var gotoContent = Ext.get("modx-content"); gotoContent.focus();}
			    }

			}

			if(key == 37){ //left
				if(rootItem){ rootItem.removeClass('open'); }
				//clear all child tabindexes
				Ext.each(Ext.get('modx-topnav').query('.modx-subnav li'), function(item,idx){
			        item.removeAttribute('tabindex');
			    });
			    var prevLi = Ext.get(elp).prev('li');
			    if(prevLi){
			        var prevLichild = prevLi.dom.childNodes[1];
			        prevLichild.focus();
			    } else {
			        //it might be "user"
			        if(elp == "limenu-user"){var userLi = Ext.get("limenu-manage");  userLi.dom.childNodes[1].focus();}
			    }

			}

			if(key == 9){ //tab
			    var gotoContent = Ext.get("modx-content");
			    gotoContent.focus();
			}

	    } else {

		    //its a child li
		    var elRootParent = Ext.get(el).parent();
		    //console.log(elRootParent);
		    if( Ext.get(el).parent('.top') ){
    		    var elRootParent = Ext.get(el).parent('.top');
    		    var elUlParent = Ext.get(el).parent('.modx-subnav');
    		    var elLink = Ext.get(el).query('a');
    		    var elHref = elLink[0]["href"];

    			var elPrevLi = Ext.get(el).prev('li');
    			var elNextLi = Ext.get(el).next('li');

    		    if(key == 13){ //enter
    				window.open(elHref,'_self');
    			}

    		    if(key == 39){ // right
    				//clear all child tabindexes
    				Ext.each(Ext.get('modx-topnav').query('.modx-subnav li'), function(item,idx){
    			        item.removeAttribute('tabindex');
    			    });
    			    elUlParent.removeClass('open');
    				var testNextDom = elRootParent.next('.top');
    				if(testNextDom){
    			        elRootParent.next('.top').dom.childNodes[1].focus();
    			    } else {
    			        //it might be "manage" or "help"
    			        if(elRootParent.id == "limenu-manage"){var userLi = Ext.get("limenu-user");  userLi.dom.childNodes[1].focus();}
    			        if(elRootParent.id == "limenu-admin"){var userLi = Ext.get("limenu-about");  userLi.dom.childNodes[1].focus();}
    			        if(elRootParent.id == "limenu-about"){var gotoContent = Ext.get("modx-content"); gotoContent.focus();}
    			    }
    			}

    			if(key == 37){ // left
    				//clear all child tabindexes
    				Ext.each(Ext.get('modx-topnav').query('.modx-subnav li'), function(item,idx){
    			        item.removeAttribute('tabindex');
    			    });
    			    elUlParent.removeClass('open');
    			    var testPrevDom = elRootParent.prev('.top');
    			    if(testPrevDom){
    			        elRootParent.prev('.top').dom.childNodes[1].focus();
    			    } else {
    				    //it might be "user"
    			        if(elRootParent.id == "limenu-user"){var userLi = Ext.get("limenu-manage");  userLi.dom.childNodes[1].focus();}
    			    }
    			}

    			if(key == 40){ //down
    				if(elNextLi){
    				    elNextLi.focus();
    				} else {
    				    //might be bottom of li
    				    //might be #reports
    				    if(el == "reports"){ var reportSub = Ext.get("site_schedule"); reportSub.focus(); }
    				}
    			}

    			if(key == 38){ //up
    				if(elPrevLi){
    			        elPrevLi.focus();
    			    } else {
    			        if(el == "site_schedule"){ var reportSub = Ext.get("reports"); reportSub.focus(); }
    			    }
    			}
            } else { //eof its a child li
                //its a 3rd level
                var elLink = Ext.get(el).query('a');
    		    var elHref = elLink[0]["href"];

    			var elPrevLi = Ext.get(el).prev('li');
    			var elNextLi = Ext.get(el).next('li');

    		    if(key == 13){ //enter
    				window.open(elHref,'_self');
    			}

                if(key == 40){ //down
    				elNextLi.focus();
    			}

    			if(key == 38){ //up
    			    if(elPrevLi){
    			        elPrevLi.focus();
    			    } else {
    			        if(el == "site_schedule"){ var reportSub = Ext.get("reports"); reportSub.focus(); }
    			    }
    			}
            }

	    }  // eof if main dropdown or else child

} // eof uberBarMovement

MODx.a11y = Ext.apply(Ext.a11y, {
    init: function() {

		Ext.get('modx-topnav').on('keydown', function(e){
			if(e.within(this)){
				var liTarget = e.target.id; // new_resource - after the rootItem focus otherwise empty
				//console.log("e: "+e.target.id);
				var liTargetParent = e.target.parentElement.id; // limenu-site - on tab focus otherwise empty
                //console.log("parent: "+liTargetParent);
                var activeKey = e.getKey();
                uberBarMovement(activeKey,liTarget,liTargetParent);
            }
		});

		Ext.get('modx-user-menu').on('keydown', function(e){
			if(e.within(this)){
				var liTarget = e.target.id; // new_resource - after the rootItem focus otherwise empty
				//console.log("e: "+e.target.id);
				var liTargetParent = e.target.parentElement.id; // limenu-site - on tab focus otherwise empty
                //console.log("parent: "+liTargetParent);
                var activeKey = e.getKey();
                uberBarMovement(activeKey,liTarget,liTargetParent);
            }
		});


        /*give help an ID by editing line 175 in /controllers/
        Ext.get('help-link').on({
            'keydown':this.clearSubNavOpen
        });
        */

        /* search actions - @dubrod - not needed since i moved the whole search element up
        Ext.get('modx-uberbar').on({
            'focus':function(){
                Ext.get('mgr-search-wrapper').addClass('search-movement');
            }
            ,'blur': function(){
                Ext.get('mgr-search-wrapper').removeClass('search-movement');
            }
        });
        */

        this.initFont();
    }

    ,initFont:function(){
        var cookie = new MODx.cookie();
        var bfsCheck = cookie.get('bodyfontsize');
        if (!bfsCheck) {
            cookie.create("bodyfontsize", 0, 30);
            setTimeout(function () {
                Ext.get('modx-body-tag').setStyle('font-size', "1.0em");
            }, 1000);
        } else {
            setTimeout(function () {
                Ext.get('modx-body-tag').setStyle('font-size', "1."+bfsCheck+"em");
            }, 1000);
        }
        var dstCheck = cookie.get('dysfont');
        if(dstCheck){
            Ext.DomHelper.append(Ext.getHead(), {
                tag: 'link'
                ,type:'text/css'
                ,rel:'stylesheet'
                ,href:MODx.config.manager_url+'templates/a11y/css/dyslexia.css'
            });
        }
    }
    ,bfsIncrease: function(){
        var cookie = new MODx.cookie();
        var bfsCheck = cookie.get('bodyfontsize');
        var newBfs = Number(bfsCheck)+1;
        cookie.create("bodyfontsize", newBfs, 30);
        Ext.get('modx-body-tag').setStyle('font-size', "1."+newBfs+"em");
    }
    ,bfsDecrease:function(){
        var cookie = new MODx.cookie();
        var bfsCheck = cookie.get('bodyfontsize');
        var newBfs = Number(bfsCheck)-1;
        if (newBfs<0)return;
        cookie.create("bodyfontsize", newBfs, 30);
        Ext.get('modx-body-tag').setStyle('font-size', "1."+newBfs+"em");
    }
    ,dyslexiaToggler:function(){
        var cookie = new MODx.cookie();
        var dstCheck = cookie.get('dysfont');
        if(dstCheck){
            cookie.remove("dysfont");
            location.reload();
        } else {
            cookie.create("dysfont", "true", 30);
            location.reload();
        }
    }
    ,initTree:function(){
        //Vertical Tab role assignment
        var modxLayout = Ext.getCmp('modx-layout');
console.log('modxLayout',modxLayout);
        var tabPanel = Ext.getCmp('modx-leftbar-tabs');
        if (typeof(tabPanel)!=='undefined') {
console.log('this',this);
            this.ARIA.setRole('modx-leftbar-tabs', 'tablist');
            this.ARIA.setProperty('modx-leftbar', 'aria-label', 'Resources Elements and Files Tablist');
//            Ext.getCmp('modx-leftbar-tabs').initFocus();
        }
        var resTree = Ext.getCmp('modx-resource-tree');
console.log('resTree',resTree);
        if (typeof(resTree)!=='undefined') {
            this.ARIA.setProperty('modx-resource-tree', 'role', 'tab');
//            Ext.getCmp('modx-resource-tree').getEl().addClass('x-a11y-focusable');
            resTree.on('expand',function(panel){
console.log('panel',panel);
            });
        }
        var elTree = Ext.getCmp('modx-tree-element');
        if (typeof(elTree)!=='undefined') {
            this.ARIA.setProperty('modx-tree-element', 'role', 'tab');
//            Ext.getCmp('modx-tree-element').getEl().addClass('x-a11y-focusable');
        }
        var fileTree = Ext.getCmp('modx-file-tree');
        if (typeof(fileTree)!=='undefined') {
            this.ARIA.setProperty('modx-file-tree', 'role', 'tab');
//            Ext.getCmp('modx-file-tree').getEl().addClass('x-a11y-focusable');
            fileTree.initFocus();
        }
    }
});

MODx.cookie = function(){
    return {
        create: function(name, value, days) {
            var expires;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
        }
        ,get: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        ,remove: function(name){
            this.create(name,"",-1);
        }
    };
};
