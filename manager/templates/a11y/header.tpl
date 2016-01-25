<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="{$_config.manager_direction}" lang="{$_config.manager_lang_attribute}" xml:lang="{$_config.manager_lang_attribute}"{if $_config.manager_html5_cache EQ 1} manifest="{$_config.manager_url}cache.manifest.php"{/if}>
<head>
<title>{if $_pagetitle}{$_pagetitle} | {/if}{$_config.site_name}</title>
<meta http-equiv="Content-Type" content="text/html; charset={$_config.modx_charset}" />

{if $_config.manager_favicon_url}<link rel="shortcut icon" href="{$_config.manager_favicon_url}" />{/if}

<link rel="stylesheet" type="text/css" href="{$_config.manager_url}templates/{$_config.manager_theme}/css/ext-all-notheme-min.css" />
<link rel="stylesheet" type="text/css" href="{$_config.manager_url}templates/{$_config.manager_theme}/css/index.css" />

{if $_config.ext_debug}
<script src="{$_config.manager_url}assets/ext3/adapter/ext/ext-base-debug.js" type="text/javascript"></script>
<script src="{$_config.manager_url}assets/ext3/ext-all-debug.js" type="text/javascript"></script>
{else}
<script src="{$_config.manager_url}assets/ext3/adapter/ext/ext-base.js" type="text/javascript"></script>
<script src="{$_config.manager_url}assets/ext3/ext-all.js" type="text/javascript"></script>
{/if}
<script src="{$_config.manager_url}assets/modext/core/modx.js" type="text/javascript"></script>
<!--<script src="{$_config.manager_url}templates/{$_config.manager_theme}/js/ux/Focus.js" type="text/javascript"></script>-->
<script src="{$_config.manager_url}templates/{$_config.manager_theme}/js/tree/ARIA.js" type="text/javascript"></script>
<script src="{$_config.manager_url}templates/{$_config.manager_theme}/js/modext/core/modx.a11y.js" type="text/javascript"></script>
<script src="{$_config.manager_url}templates/{$_config.manager_theme}/js/modext/core/a11y.overrides.js" type="text/javascript"></script>

<script src="{$_config.connectors_url}lang.js.php?ctx=mgr&topic=topmenu,file,resource,{$_lang_topics}&action={$smarty.get.a|strip_tags}" type="text/javascript"></script>
<script src="{$_config.connectors_url}modx.config.js.php?action={$smarty.get.a|strip_tags}{if $_ctx}&wctx={$_ctx}{/if}" type="text/javascript"></script>

{if $_config.compress_js && $_config.compress_js_groups}
<script src="{$_config.manager_url}min/index.php?g=coreJs1" type="text/javascript"></script>
<script src="{$_config.manager_url}min/index.php?g=coreJs2" type="text/javascript"></script>
<script src="{$_config.manager_url}min/index.php?g=coreJs3" type="text/javascript"></script>
{/if}

{if $_search}
<script type="text/javascript">
    Ext.onReady(function() {
        Ext.override(MODx.SearchBar, {
		    animate: function(blur) {}
		});
        new MODx.SearchBar;
        MODx.a11y.init();
    });
</script>
{/if}

{$maincssjs}
{foreach from=$cssjs item=scr}
{$scr}
{/foreach}

</head>
<body id="modx-body-tag">

<div id="modx-browser"></div>

<div id="modx-container">

  <div id="modAB"></div>

  <div id="modx-leftbar" role="tabpanel" tabindex="0">
    <p class="sr-only">{$_lang.a11y.tree_instructions}</p>
  </div>

  <div id="modx-header" role="banner">
      <div id="modx-navbar" tabindex="0">

    		<div style="clear:both;">
    			<div id="modx-home-dashboard"><a href="?" title="{$_lang.dashboard}">{$_lang.dashboard}</a></div>
      			{if $_search}
	            <div role="search" id="mgr-search-wrapper">
  		            <!--<i class="icon icon-search icon-2x"></i>-->
  	            <div id="modx-manager-search"><label for="modx-uberbar" id="modx-uberbar-label">{$_lang.search}</label></div>
	            </div>
            {/if}
    		</div>
        <div id="new-menu-wrapper">
    			<nav role="navigation" aria-label="manager menu">
    				<h2 class="sr-only">Global Navigation</h2>
    		        <ul id="modx-topnav" role="menubar">
    		            {$navb}
    		        </ul>
    			</nav>
    			<nav role="navigation" aria-label="user and system menu">
    		        <ul id="modx-user-menu" role="menubar">
    		            {* eval is used here to support nested variables *}
    		            {eval var=$userNav}
    		        </ul>
    			</nav>
    			<div style="clear:both;"></div>
        </div>

      </div>
  </div>

  <main role="main">
    <div id="modx-content" tabindex="0">

    	<div id="modx-panel-holder"></div>