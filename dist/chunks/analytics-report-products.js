(window.__wcAdmin_webpackJsonp=window.__wcAdmin_webpackJsonp||[]).push([[15],{480:function(e,t,r){"use strict";r.r(t);var o=r(5),a=r.n(o),c=r(11),n=r.n(c),i=r(12),s=r.n(i),l=r(13),u=r.n(l),m=r(14),d=r.n(m),p=r(6),b=r.n(p),_=r(0),f=r(2),y=r(18),v=r(1),O=r.n(v),h=r(23),g=r(15),j=r(517),w=r(500),S=r(527),k=r(499),C=r(496),q=r(501),R=r(518),P=r(502),E=r(73);function F(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function V(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?F(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):F(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,o=b()(e);if(t){var a=b()(this).constructor;r=Reflect.construct(o,arguments,a)}else r=o.apply(this,arguments);return d()(this,r)}}var x=function(e){u()(r,e);var t=L(r);function r(){return n()(this,r),t.apply(this,arguments)}return s()(r,[{key:"getChartMeta",value:function(){var e=this.props,t=e.query,r=e.isSingleProductView,o=e.isSingleProductVariable,a="compare-products"===t.filter&&t.products&&t.products.split(",").length>1||r&&o?"item-comparison":"time-comparison";return{compareObject:r&&o?"variations":"products",itemsLabel:r&&o?Object(f.__)("%d variations","woocommerce-admin"):Object(f.__)("%d products","woocommerce-admin"),mode:a}}},{key:"render",value:function(){var e=this.getChartMeta(),t=e.compareObject,r=e.itemsLabel,o=e.mode,a=this.props,c=a.path,n=a.query,i=a.isError,s=a.isRequesting,l=a.isSingleProductVariable,u=a.addCesSurveyForAnalytics;if(i)return Object(_.createElement)(C.a,{isError:!0});var m=V({},n);return"item-comparison"===o&&(m.segmentby="products"===t?"product":"variation"),j.c[0].filters.find((function(e){return"compare-products"===e.value})).settings.onClick=u,Object(_.createElement)(_.Fragment,null,Object(_.createElement)(P.a,{query:n,path:c,filters:j.c,advancedFilters:j.a,report:"products"}),Object(_.createElement)(q.a,{mode:o,charts:j.b,endpoint:"products",isRequesting:s,query:m,selectedChart:Object(w.a)(n.chart,j.b),filters:j.c,advancedFilters:j.a}),Object(_.createElement)(k.a,{charts:j.b,mode:o,filters:j.c,advancedFilters:j.a,endpoint:"products",isRequesting:s,itemsLabel:r,path:c,query:m,selectedChart:Object(w.a)(m.chart,j.b)}),l?Object(_.createElement)(R.a,{baseSearchQuery:{filter:"single_product"},isRequesting:s,query:n,filters:j.c,advancedFilters:j.a}):Object(_.createElement)(S.a,{isRequesting:s,query:n,filters:j.c,advancedFilters:j.a}))}}]),r}(_.Component);x.propTypes={path:O.a.string.isRequired,query:O.a.object.isRequired},t.default=Object(y.compose)(Object(g.withSelect)((function(e,t){var r=t.query,o=t.isRequesting,a=!r.search&&r.products&&1===r.products.split(",").length;if(o)return{query:V({},r),isSingleProductView:a,isRequesting:o};var c=e(h.ITEMS_STORE_NAME),n=c.getItems,i=c.isResolving,s=c.getItemsError;if(a){var l=parseInt(r.products,10),u={include:l},m=n("products",u),d=m&&m.get(l)&&"variable"===m.get(l).type,p=i("getItems",["products",u]),b=Boolean(s("products",u));return{query:V(V({},r),{},{"is-variable":d}),isSingleProductView:a,isRequesting:p,isSingleProductVariable:d,isError:b}}return{query:r,isSingleProductView:a}})),Object(g.withDispatch)((function(e){return{addCesSurveyForAnalytics:e(E.c).addCesSurveyForAnalytics}})))(x)},517:function(e,t,r){"use strict";r.d(t,"b",(function(){return n})),r.d(t,"c",(function(){return l})),r.d(t,"a",(function(){return u}));var o=r(2),a=r(42),c=r(497),n=Object(a.applyFilters)("woocommerce_admin_products_report_charts",[{key:"items_sold",label:Object(o.__)("Items Sold","woocommerce-admin"),order:"desc",orderby:"items_sold",type:"number"},{key:"net_revenue",label:Object(o.__)("Net Sales","woocommerce-admin"),order:"desc",orderby:"net_revenue",type:"currency"},{key:"orders_count",label:Object(o.__)("Orders","woocommerce-admin"),order:"desc",orderby:"orders_count",type:"number"}]),i={label:Object(o.__)("Show","woocommerce-admin"),staticParams:["chartType","paged","per_page"],param:"filter",showFilters:function(){return!0},filters:[{label:Object(o.__)("All Products","woocommerce-admin"),value:"all"},{label:Object(o.__)("Single Product","woocommerce-admin"),value:"select_product",chartMode:"item-comparison",subFilters:[{component:"Search",value:"single_product",chartMode:"item-comparison",path:["select_product"],settings:{type:"products",param:"products",getLabels:c.d,labels:{placeholder:Object(o.__)("Type to search for a product","woocommerce-admin"),button:Object(o.__)("Single Product","woocommerce-admin")}}}]},{label:Object(o.__)("Comparison","woocommerce-admin"),value:"compare-products",chartMode:"item-comparison",settings:{type:"products",param:"products",getLabels:c.d,labels:{helpText:Object(o.__)("Check at least two products below to compare","woocommerce-admin"),placeholder:Object(o.__)("Search for products to compare","woocommerce-admin"),title:Object(o.__)("Compare Products","woocommerce-admin"),update:Object(o.__)("Compare","woocommerce-admin")}}}]},s={showFilters:function(e){return"single_product"===e.filter&&!!e.products&&e["is-variable"]},staticParams:["filter","products","chartType","paged","per_page"],param:"filter-variations",filters:[{label:Object(o.__)("All Variations","woocommerce-admin"),chartMode:"item-comparison",value:"all"},{label:Object(o.__)("Single Variation","woocommerce-admin"),value:"select_variation",subFilters:[{component:"Search",value:"single_variation",path:["select_variation"],settings:{type:"variations",param:"variations",getLabels:c.g,labels:{placeholder:Object(o.__)("Type to search for a variation","woocommerce-admin"),button:Object(o.__)("Single Variation","woocommerce-admin")}}}]},{label:Object(o.__)("Comparison","woocommerce-admin"),chartMode:"item-comparison",value:"compare-variations",settings:{type:"variations",param:"variations",getLabels:c.g,labels:{helpText:Object(o.__)("Check at least two variations below to compare","woocommerce-admin"),placeholder:Object(o.__)("Search for variations to compare","woocommerce-admin"),title:Object(o.__)("Compare Variations","woocommerce-admin"),update:Object(o.__)("Compare","woocommerce-admin")}}}]},l=Object(a.applyFilters)("woocommerce_admin_products_report_filters",[i,s]),u=Object(a.applyFilters)("woocommerce_admin_products_report_advanced_filters",{})},518:function(e,t,r){"use strict";var o=r(11),a=r.n(o),c=r(12),n=r.n(c),i=r(9),s=r.n(i),l=r(13),u=r.n(l),m=r(14),d=r.n(m),p=r(6),b=r.n(p),_=r(0),f=r(2),y=r(3),v=r(47),O=r(21),h=r(142),g=r(25),j=r(503),w=r(509),S=r(495),k=r(497);function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,o=b()(e);if(t){var a=b()(this).constructor;r=Reflect.construct(o,arguments,a)}else r=o.apply(this,arguments);return d()(this,r)}}var q=Object(g.g)("manageStock","no"),R=Object(g.g)("stockStatuses",{}),P=function(e){return Object(k.h)(e.extended_info||{})},E=function(e){u()(r,e);var t=C(r);function r(){var e;return a()(this,r),(e=t.call(this)).getHeadersContent=e.getHeadersContent.bind(s()(e)),e.getRowsContent=e.getRowsContent.bind(s()(e)),e.getSummary=e.getSummary.bind(s()(e)),e}return n()(r,[{key:"getHeadersContent",value:function(){return[{label:Object(f.__)("Product / Variation Title","woocommerce-admin"),key:"name",required:!0,isLeftAligned:!0},{label:Object(f.__)("SKU","woocommerce-admin"),key:"sku",hiddenByDefault:!0,isSortable:!0},{label:Object(f.__)("Items Sold","woocommerce-admin"),key:"items_sold",required:!0,defaultSort:!0,isSortable:!0,isNumeric:!0},{label:Object(f.__)("Net Sales","woocommerce-admin"),screenReaderLabel:Object(f.__)("Net Sales","woocommerce-admin"),key:"net_revenue",required:!0,isSortable:!0,isNumeric:!0},{label:Object(f.__)("Orders","woocommerce-admin"),key:"orders_count",isSortable:!0,isNumeric:!0},"yes"===q?{label:Object(f.__)("Status","woocommerce-admin"),key:"stock_status"}:null,"yes"===q?{label:Object(f.__)("Stock","woocommerce-admin"),key:"stock",isNumeric:!0}:null].filter(Boolean)}},{key:"getRowsContent",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=this.props.query,r=Object(O.getPersistedQuery)(t),o=this.context,a=o.formatAmount,c=o.formatDecimal,n=o.getCurrencyConfig;return Object(y.map)(e,(function(e){var t=e.items_sold,o=e.net_revenue,i=e.orders_count,s=e.product_id,l=e.variation_id,u=e.extended_info||{},m=u.stock_status,d=u.stock_quantity,p=u.low_stock_amount,b=u.sku,y=P(e),j=Object(O.getNewPath)(r,"/analytics/orders",{filter:"advanced",variation_includes:l}),S=Object(g.f)("post.php?post=".concat(s,"&action=edit"));return[{display:Object(_.createElement)(v.Link,{href:S,type:"wp-admin"},y),value:y},{display:b,value:b},{display:Object(h.formatValue)(n(),"number",t),value:t},{display:a(o),value:c(o)},{display:Object(_.createElement)(v.Link,{href:j,type:"wc-admin"},i),value:i},"yes"===q?{display:Object(w.a)(m,d,p)?Object(_.createElement)(v.Link,{href:S,type:"wp-admin"},Object(f._x)("Low","Indication of a low quantity","woocommerce-admin")):R[m],value:R[m]}:null,"yes"===q?{display:d,value:d}:null].filter(Boolean)}))}},{key:"getSummary",value:function(e){var t=e.variations_count,r=void 0===t?0:t,o=e.items_sold,a=void 0===o?0:o,c=e.net_revenue,n=void 0===c?0:c,i=e.orders_count,s=void 0===i?0:i,l=this.context,u=l.formatAmount,m=(0,l.getCurrencyConfig)();return[{label:Object(f._n)("variation sold","variations sold",r,"woocommerce-admin"),value:Object(h.formatValue)(m,"number",r)},{label:Object(f._n)("item sold","items sold",a,"woocommerce-admin"),value:Object(h.formatValue)(m,"number",a)},{label:Object(f.__)("net sales","woocommerce-admin"),value:u(n)},{label:Object(f._n)("orders","orders",s,"woocommerce-admin"),value:Object(h.formatValue)(m,"number",s)}]}},{key:"render",value:function(){var e=this.props,t=e.advancedFilters,r=e.baseSearchQuery,o=e.filters,a=e.isRequesting,c=e.query,n={helpText:Object(f.__)("Check at least two variations below to compare","woocommerce-admin"),placeholder:Object(f.__)("Search by variation name or SKU","woocommerce-admin")};return Object(_.createElement)(j.a,{baseSearchQuery:r,compareBy:"variations",compareParam:"filter-variations",endpoint:"variations",getHeadersContent:this.getHeadersContent,getRowsContent:this.getRowsContent,isRequesting:a,itemIdField:"variation_id",labels:n,query:c,getSummary:this.getSummary,summaryFields:["variations_count","items_sold","net_revenue","orders_count"],tableQuery:{orderby:c.orderby||"items_sold",order:c.order||"desc",extended_info:!0,products:c.products,variations:c.variations},title:Object(f.__)("Variations","woocommerce-admin"),columnPrefsKey:"variations_report_columns",filters:o,advancedFilters:t})}}]),r}(_.Component);E.contextType=S.a,t.a=E}}]);