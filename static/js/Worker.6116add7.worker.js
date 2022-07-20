/*! For license information please see Worker.6116add7.worker.js.LICENSE.txt */
!function(){"use strict";var t,e={d:function(t,r){for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}};function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function n(t,e){if(t){if("string"===typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}function i(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,i,a=[],o=!0,s=!1;try{for(r=r.call(t);!(o=(n=r.next()).done)&&(a.push(n.value),!e||a.length!==e);o=!0);}catch(h){s=!0,i=h}finally{try{o||null==r.return||r.return()}finally{if(s)throw i}}return a}}(t,e)||n(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function o(){o=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},i=n.iterator||"@@iterator",s=n.asyncIterator||"@@asyncIterator",h=n.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(A){l=function(t,e,r){return t[e]=r}}function u(t,e,r,n){var i=e&&e.prototype instanceof v?e:v,a=Object.create(i.prototype),o=new M(n||[]);return a._invoke=function(t,e,r){var n="suspendedStart";return function(i,a){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===i)throw a;return E()}for(r.method=i,r.arg=a;;){var o=r.delegate;if(o){var s=k(o,r);if(s){if(s===f)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var h=c(t,e,r);if("normal"===h.type){if(n=r.done?"completed":"suspendedYield",h.arg===f)continue;return{value:h.arg,done:r.done}}"throw"===h.type&&(n="completed",r.method="throw",r.arg=h.arg)}}}(t,r,o),a}function c(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(A){return{type:"throw",arg:A}}}t.wrap=u;var f={};function v(){}function d(){}function p(){}var y={};l(y,i,(function(){return this}));var b=Object.getPrototypeOf,w=b&&b(b(N([])));w&&w!==e&&r.call(w,i)&&(y=w);var g=p.prototype=v.prototype=Object.create(y);function m(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function P(t,e){function n(i,o,s,h){var l=c(t[i],t,o);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==a(f)&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,s,h)}),(function(t){n("throw",t,s,h)})):e.resolve(f).then((function(t){u.value=t,s(u)}),(function(t){return n("throw",t,s,h)}))}h(l.arg)}var i;this._invoke=function(t,r){function a(){return new e((function(e,i){n(t,r,e,i)}))}return i=i?i.then(a,a):a()}}function k(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,k(t,e),"throw"===e.method))return f;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return f}var n=c(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,f;var i=n.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,f):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,f)}function I(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function x(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function M(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(I,this),this.reset(!0)}function N(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,a=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return a.next=a}}return{next:E}}function E(){return{value:void 0,done:!0}}return d.prototype=p,l(g,"constructor",p),l(p,"constructor",d),d.displayName=l(p,h,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,p):(t.__proto__=p,l(t,h,"GeneratorFunction")),t.prototype=Object.create(g),t},t.awrap=function(t){return{__await:t}},m(P.prototype),l(P.prototype,s,(function(){return this})),t.AsyncIterator=P,t.async=function(e,r,n,i,a){void 0===a&&(a=Promise);var o=new P(u(e,r,n,i),a);return t.isGeneratorFunction(r)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},m(g),l(g,h,"Generator"),l(g,i,(function(){return this})),l(g,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=N,M.prototype={constructor:M,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(x),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return o.type="throw",o.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],o=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var s=r.call(a,"catchLoc"),h=r.call(a,"finallyLoc");if(s&&h){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!h)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var a=i;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=t,o.arg=e,a?(this.method="next",this.next=a.finallyLoc,f):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),x(r),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var i=n.arg;x(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:N(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),f}},t}function s(t,e,r,n,i,a,o){try{var s=t[a](o),h=s.value}catch(l){return void r(l)}s.done?e(h):Promise.resolve(h).then(n,i)}function h(t){return function(){var e=this,r=arguments;return new Promise((function(n,i){var a=t.apply(e,r);function o(t){s(a,n,i,o,h,"next",t)}function h(t){s(a,n,i,o,h,"throw",t)}o(void 0)}))}}function l(t){return function(t){if(Array.isArray(t))return r(t)}(t)||function(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||n(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t,e){var r="undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=n(t))||e&&t&&"number"===typeof t.length){r&&(t=r);var i=0,a=function(){};return{s:a,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,s=!0,h=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return s=t.done,t},e:function(t){h=!0,o=t},f:function(){try{s||null==r.return||r.return()}finally{if(h)throw o}}}}function c(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function f(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function v(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?f(Object(r),!0).forEach((function(e){c(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function d(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function p(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function y(t,e,r){return e&&p(t.prototype,e),r&&p(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}e.d({},{k:function(){return j}}),function(t){t.Vertical="v",t.Horizontal="h"}(t||(t={}));var b,w="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function g(t){if(t[0]<0||t[0]>=w.length)throw new Error("Board is to large to be represented by standard notation");return w[Math.floor(t[0]/2)]+Math.ceil(t[1]/2)}function m(t){return[2*w.indexOf(t[0])+1,2*Number.parseInt(t.substring(1))-1]}function P(e){if(e.endsWith(t.Vertical)||e.endsWith(t.Horizontal)){var r=e.endsWith(t.Vertical)?t.Vertical:t.Horizontal,n=w.indexOf(e[0]),i=Number.parseInt(e.substring(1,e.length-1));return r===t.Horizontal?{square:[2*n,2*i-1],orientation:r}:{square:[2*n+1,2*i],orientation:r}}return{target:m(e)}}function k(e){var r=e.move;return"target"in r?g(r.target):r.orientation===t.Vertical?g(r.square)+"v":g(r.square)+"h"}!function(t){t[t.white=0]="white",t[t.black=1]="black"}(b||(b={}));var I={boardWidth:9,boardHeight:9,walls:10,pawns:1},x=function(){function e(){var t=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:I,n=arguments.length>1?arguments[1]:void 0;d(this,e),this.pawnPositions=void 0,this.wallsAvailable=void 0,this.board=void 0,this.settings=void 0,this.currentPlayer=void 0,this.width=void 0,this.height=void 0,this.illegal=!1,this.shortestPaths=void 0,this.turn=0,this.precomputedMoves=void 0,this._children=void 0,this.settings=v(v({},I),r),this.wallsAvailable=[this.settings.walls,this.settings.walls],this.width=2*this.settings.boardWidth+1,this.height=2*this.settings.boardHeight+1,this.shortestPaths=[this.settings.boardHeight,this.settings.boardHeight];var i=Math.ceil(this.settings.boardWidth/2);if(this.pawnPositions=[[1,2*i-1],[this.height-2,2*i-1]],this.board=new Array(this.height).fill(0).map((function(){return new Int8Array(t.width).fill(-1)})),n){for(var a=0;a<this.height;a++)this.board[a][0]=1,this.board[a][this.width-1]=1;for(var o=0;o<this.width;o++)this.board[0][o]=1,this.board[this.height-1][o]=1;this.whiteBFS(),this.blackBFS()}this.currentPlayer=b.white}return y(e,[{key:"isLegal",value:function(t){return"string"===typeof t?this.legalMoves.has(t):this.legalMoves.has(k({move:t}))}},{key:"winner",value:function(){return this.pawnPositions[b.white][0]>=this.height-2?b.white:this.pawnPositions[b.black][0]<=1?b.black:null}},{key:"result",value:function(t){return this.isGameOver()?this.winner()===t?1:0:this.automaticPlayout()===t?1:0}},{key:"isGameOver",value:function(){return null!==this.winner()}},{key:"automaticPlayoutPossible",get:function(){return 0===this.wallsAvailable[0]&&0===this.wallsAvailable[1]}},{key:"automaticPlayout",value:function(){var t=this,e=this.shortestPaths[this.currentPlayer]-this.shortestPaths[this.opponent];if(e>=2)return this.opponent;if(e<=-2)return this.currentPlayer;var r=function(){var r=t.shortestPaths[t.currentPlayer]-1,n=new Set;n.add(t.pawnPositions[t.currentPlayer]);for(var a=!1,o=new Array(t.height).fill(0).map((function(){return new Array(t.width).fill(-1)})),s=function(){var e,s=new Set,h=u(n.values());try{var l=function(){var n=i(e.value,2),h=n[0],l=n[1],u=[[h+2,l],[h,l+2],[h,l-2],[h-2,l]],c=[t.board[h+1][l],t.board[h][l+1],t.board[h][l-1],t.board[h-1][l]];-1!==t.board[h][l]&&t.board[h][l]===t.board[h-1][l-1]?a=!0:u.forEach((function(e,n){var a=i(e,2),h=a[0],l=a[1];1===c[n]||h<0||h>=t.height||l<0||l>=t.width||-1===o[h][l]&&(t.currentPlayer===b.white&&t.board[h][l]===r||t.currentPlayer===b.black&&t.board[h-1][l-1]===r)&&(s.add([h,l]),o[h][l]=r)}))};for(h.s();!(e=h.n()).done;)l()}catch(c){h.e(c)}finally{h.f()}if(a)return"break";n=s,r--};r>0;){if("break"===s())break}var h=r;r=t.shortestPaths[t.opponent]-1,(n=new Set).add(t.pawnPositions[t.opponent]);for(var l=new Array(t.height).fill(0).map((function(){return new Array(t.width).fill(-1)})),c=function(){var e,a=new Set,o=u(n.values());try{var s=function(){var n=i(e.value,2),o=n[0],s=n[1],h=[[o+2,s],[o,s+2],[o,s-2],[o-2,s]],u=[t.board[o+1][s],t.board[o][s+1],t.board[o][s-1],t.board[o-1][s]];h.forEach((function(e,n){var o=i(e,2),s=o[0],h=o[1];1===u[n]||s<0||s>=t.height||h<0||h>=t.width||-1===l[s][h]&&(t.opponent===b.white&&t.board[s][h]===r||t.opponent===b.black&&t.board[s-1][h-1]===r)&&(a.add([s,h]),l[s][h]=r)}))};for(o.s();!(e=o.n()).done;)s()}catch(h){o.e(h)}finally{o.f()}n=a,r--};r>h;)c();var f,v=!!n.size,d=u(n);try{for(d.s();!(f=d.n()).done;){var p=i(f.value,2),y=p[0],w=p[1];-1!==o[y][w]&&t.board[y][w]===t.board[y-1][w-1]||(v=!1)}}catch(g){d.e(g)}finally{d.f()}return a&&v?{v:null}:e>0?{v:t.opponent}:{v:t.currentPlayer}}();return"object"===typeof r?r.v:void 0}},{key:"placeWall",value:function(e,r){var n=i(e.square,2),a=n[0],o=n[1];e.orientation===t.Horizontal?(r[a][o]=1,r[a][o+2]=1):(r[a][o]=1,r[a+2][o]=1)}},{key:"clone",value:function(){for(var t=new e(this.settings),r=0;r<this.height;r++)for(var n=0;n<this.width;n++)t.board[r][n]=this.board[r][n];return t.pawnPositions=l(this.pawnPositions),t.wallsAvailable=l(this.wallsAvailable),t.shortestPaths=l(this.shortestPaths),t._children=new Map(this._children),t.precomputedMoves=new Set(this.precomputedMoves),t}},{key:"makeMove",value:function(t){if("string"===typeof t){if(this.legalMoves.has(t)){var r=this.children.get(t);if(r)return r}t=P(t)}for(var n=new e(this.settings),i=0;i<this.height;i++)for(var a=0;a<this.width;a++)n.board[i][a]=this.board[i][a],i%2==0&&a%2==0&&(n.board[i][a]=-1),i%2==1&&a%2==1&&(n.board[i][a]=-1);n.pawnPositions=l(this.pawnPositions),n.wallsAvailable=l(this.wallsAvailable),n.currentPlayer=this.currentPlayer===b.white?b.black:b.white,n.turn=this.turn+1,"target"in t?n.pawnPositions[this.currentPlayer]=t.target:(n.placeWall(t,n.board),n.wallsAvailable[this.currentPlayer]--);var o=n.whiteBFS();-1===o&&(n.illegal=!0),n.shortestPaths[b.white]=o;var s=n.blackBFS();return-1===s&&(n.illegal=!0),n.shortestPaths[b.black]=s,n}},{key:"makeMoveInplace",value:function(t){if("string"===typeof t&&(t=P(t)),this.currentPlayer=this.currentPlayer===b.white?b.black:b.white,this.turn=this.turn+1,"target"in t)this.pawnPositions[this.currentPlayer]=t.target;else{this.placeWall(t,this.board),this.wallsAvailable[this.currentPlayer]--;for(var e=0;e<this.height;e++)for(var r=0;r<this.width;r++)e%2==0&&r%2==0&&(this.board[e][r]=-1),e%2==1&&r%2==1&&(this.board[e][r]=-1);var n=this.whiteBFS();-1===n&&(this.illegal=!0),this.shortestPaths[b.white]=n;var i=this.blackBFS();-1===i&&(this.illegal=!0),this.shortestPaths[b.black]=i}return this}},{key:"generateManhattanMoves",value:function(t,e){var r=i(t,2),n=r[0],a=r[1],o=[[n+2,a],[n,a+2],[n,a-2],[n-2,a]],s=[e[n+1][a],e[n][a+1],e[n][a-1],e[n-1][a]];return o.filter((function(t,e){return 1!=s[e]}))}},{key:"generatePawnMoves",value:function(t){var e=this,r=[],n=this.pawnPositions[this.opponent];return this.generateManhattanMoves(t,this.board).forEach((function(i){if(i[0]===n[0]&&i[1]===n[1]){var a=[(n[0]-t[0])/2,(n[1]-t[1])/2],o=[n[0]+a[0],n[1]+a[1]];if(1!==e.board[o[0]][o[1]])r.push({target:[o[0]+a[0],o[1]+a[1]]});else{var s,h=u(e.generateManhattanMoves(n,e.board));try{for(h.s();!(s=h.n()).done;)i=s.value,n[0]===t[0]&&n[1]===t[1]||r.push({target:i})}catch(l){h.e(l)}finally{h.f()}}}else r.push({target:i})})),r}},{key:"opponent",get:function(){return this.currentPlayer===b.white?b.black:b.white}},{key:"whiteBFS",value:function(){for(var t=this,e=[],r=1;r<this.width;r+=2)e.push([this.height-2,r]),this.board[this.height-2][r]=0;for(var n=i(this.pawnPositions[b.white],2),a=n[0],o=n[1],s=function(){var r=e.shift();if(!r)return"continue";var n=i(r,2),s=n[0],h=n[1];if(s===a&&h===o)return{v:t.board[s][h]};var l=[[s+2,h],[s,h+2],[s,h-2],[s-2,h]],u=[t.board[s+1][h],t.board[s][h+1],t.board[s][h-1],t.board[s-1][h]];l.forEach((function(r,n){var a=i(r,2),o=a[0],l=a[1];1!==u[n]&&-1===t.board[o][l]&&(t.board[o][l]=t.board[s][h]+1,e.push([o,l]))}))};e.length>0;){var h=s();if("continue"!==h&&"object"===typeof h)return h.v}return-1}},{key:"blackBFS",value:function(){for(var t=this,e=[],r=1;r<this.width;r+=2)e.push([1,r]),this.board[0][r-1]=0;for(var n=i(this.pawnPositions[b.black],2),a=n[0],o=n[1],s=function(){var r=e.shift();if(!r)return"continue";var n=i(r,2),s=n[0],h=n[1];if(s===a&&h===o)return{v:t.board[s-1][h-1]};var l=[[s+2,h],[s,h+2],[s,h-2],[s-2,h]],u=[t.board[s+1][h],t.board[s][h+1],t.board[s][h-1],t.board[s-1][h]];l.forEach((function(r,n){var a=i(r,2),o=a[0],l=a[1];1!==u[n]&&-1===t.board[o-1][l-1]&&(t.board[o-1][l-1]=t.board[s-1][h-1]+1,e.push([o,l]))}))};e.length>0;){var h=s();if("continue"!==h&&"object"===typeof h)return h.v}return-1}},{key:"generateWallMoves",value:function(){var e=[];if(0===this.wallsAvailable[this.currentPlayer])return e;for(var r=1;r<this.height-3;r+=2)for(var n=2;n<this.width-2;n+=2)if(1!==this.board[r][n]&&1!==this.board[r+2][n]&&(1!==this.board[r+1][n-1]||1!==this.board[r+1][n+1])){var i={square:[r,n],orientation:t.Vertical};e.push(i)}for(var a=2;a<this.height-1;a+=2)for(var o=1;o<this.width-2;o+=2)if(1!==this.board[a][o]&&1!==this.board[a][o+2]&&(1!==this.board[a-1][o+1]||1!==this.board[a+1][o+1])){var s={square:[a,o],orientation:t.Horizontal};e.push(s)}return e}},{key:"generateAllMoves",value:function(){var t=[];return this.isGameOver()||(t=(t=this.generatePawnMoves(this.pawnPositions[this.currentPlayer])).concat(this.generateWallMoves())),t}},{key:"computeChildren",value:function(){var t=new Map;this.precomputedMoves=new Set;var e,r=u(this.generateAllMoves());try{for(r.s();!(e=r.n()).done;){var n=e.value,i=k({move:n}),a=this.makeMove(n);a.illegal||(this.precomputedMoves.add(i),t.set(i,a))}}catch(o){r.e(o)}finally{r.f()}return t}},{key:"children",get:function(){return void 0===this._children&&(this._children=this.computeChildren()),this._children}},{key:"legalMoves",get:function(){return this.precomputedMoves||(this.precomputedMoves=new Set,this.computeChildren()),this.precomputedMoves}},{key:"toString",value:function(){for(var t="",e=1;e<this.height-1;e++){for(var r=1;r<this.width-1;r++)e%2===0&&r%2===0?(this.board[e][r],t+="+"):e%2!==r%2?1===this.board[e][r]?t+="\u25a0":t+=" ":e%2===1&&r%2===1&&(this.pawnPositions[b.white][0]===e&&this.pawnPositions[b.white][1]===r?t+="\u25cb":this.pawnPositions[b.black][0]===e&&this.pawnPositions[b.black][1]===r?t+="\u25cf":t+=".");t+="\n"}return t}},{key:"toNotation",value:function(){for(var t="",e=2;e<this.height-1;e+=2)for(var r=1;r<this.width-2;r+=2)1===this.board[e][r]&&1===this.board[e][r+2]&&(t+=g([e,r])+" ",r+=2);t+="/";for(var n=2;n<this.width-2;n+=2)for(var i=1;i<this.height-3;i+=2)1===this.board[i][n]&&1===this.board[i+2][n]&&(t+=g([i,n])+" ",i+=2);return t+="/",t+=g(this.pawnPositions[0]),t+=" "+g(this.pawnPositions[1]),t+="/",t+=this.wallsAvailable[0],t+=" "+this.wallsAvailable[1],t+="/",t+=this.currentPlayer}}],[{key:"fromNotation",value:function(r,n){var i=new e(n,!0),a=r.match(/(.*)\/(.*)\/(.*) (.*)\/(\d+) (\d+)\/(\d)/);try{if(a&&8===a.length){if(null!==a[1]){var o=a[1].trim();if(o.length>0){var s,h=u(o.split(" "));try{for(h.s();!(s=h.n()).done;){var l=P(s.value+t.Horizontal);i.placeWall(l,i.board)}}catch(p){h.e(p)}finally{h.f()}}}if(null!==a[2]){var c=a[2].trim();if(c.length>0){var f,v=u(c.split(" "));try{for(v.s();!(f=v.n()).done;){var d=P(f.value+t.Vertical);i.placeWall(d,i.board)}}catch(p){v.e(p)}finally{v.f()}}}return i.pawnPositions[0]=m(a[3]),i.pawnPositions[1]=m(a[4]),i.wallsAvailable[0]=Number.parseInt(a[5]),i.wallsAvailable[1]=Number.parseInt(a[6]),i.currentPlayer="1"===a[7]?b.black:b.white,i.turn=-1,i.shortestPaths[b.white]=i.whiteBFS(),i.shortestPaths[b.black]=i.blackBFS(),i}throw console.error("invalid matches",a),new Error("Invalid State notation")}catch(y){throw console.log(r,a,y),new Error("Invalid State notation")}}}]),e}();function M(t){for(var e=t.length-1;e>0;e--){var r=Math.floor(Math.random()*(e+1)),n=[t[r],t[e]];t[e]=n[0],t[r]=n[1]}}function N(t){return t[Math.floor(Math.random()*t.length)]}function E(t,e,r){return A.apply(this,arguments)}function A(){return A=h(o().mark((function t(e,r,n){var a,s,h,c,f,v,d,p,y,b,w,g,m,P,k,I,x,N,E,A=arguments;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=null===(a=A.length>3&&void 0!==A[3]?A[3]:null)?e.currentPlayer:a,s=performance.now(),h=Number.NEGATIVE_INFINITY,c=Number.POSITIVE_INFINITY,M(f=l(e.children.entries())),v=Number.NEGATIVE_INFINITY,d="",!n){t.next=23;break}for(p=[],y=f.length,b=[],w=0;w<n.length-1;w++)b.push(f.splice(0,y/n.length));for(b.push(f),g=function(t){var o=n[t],s=b[t],l=[],f=new Promise((function(t){o.onmessage=function(e){l.push(e.data),l.length===s.length&&t(l)};var n,f=u(s);try{for(f.s();!(n=f.n()).done;){var v=i(n.value,2),d=v[0],p=v[1].toNotation();o.postMessage([j.MINMAX,d,p,e.settings,h,c,a,r-1,!1])}}catch(y){f.e(y)}finally{f.f()}}));s.length&&p.push(f)},m=0;m<n.length;m++)g(m);return t.next=19,Promise.all(p).then((function(t){console.log("All promises resolved, merging results",t);var e,r=u(t);try{for(r.s();!(e=r.n()).done;){var n,i=u(e.value);try{for(i.s();!(n=i.n()).done;){var a=n.value,o=a[0],s=a[1];s>=v&&(v=s,d=o),h=Math.max(h,v)}}catch(l){i.e(l)}finally{i.f()}}}catch(l){r.e(l)}finally{r.f()}}));case 19:return console.log("Executed alpha-beta-min-max in ".concat(performance.now()-s," ms")),t.abrupt("return",d);case 23:P=u(f);try{for(P.s();!(k=P.n()).done;)I=i(k.value,2),x=I[0],N=I[1],(E=S({state:N,alpha:h,beta:c,maxPlayer:a,depth:r-1,maximizing:!1}))>=v&&(v=E,d=x),h=Math.max(h,v)}catch(o){P.e(o)}finally{P.f()}return t.abrupt("return",d);case 26:case"end":return t.stop()}}),t)}))),A.apply(this,arguments)}function S(t){var e=t.state,r=t.alpha,n=t.beta,i=t.maxPlayer,a=t.depth,o=t.maximizing;if(e.isGameOver())return e.winner()===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(a<=0)return function(t,e){var r=t.shortestPaths[e],n=e===b.white?b.black:b.white,i=t.shortestPaths[n];return t.automaticPlayoutPossible?t.automaticPlayout()===e?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:i-r+.1*t.wallsAvailable[e]-.1*t.wallsAvailable[n]+.1*Math.random()}(e,i);var s=l(e.children.values());if(M(s),o){var h,c=Number.NEGATIVE_INFINITY,f=u(s);try{for(f.s();!(h=f.n()).done;){var v=h.value;if(c=Math.max(c,S({state:v,alpha:r,beta:n,maxPlayer:i,depth:a-1,maximizing:!1})),r=Math.max(r,c),c>=n)break}}catch(g){f.e(g)}finally{f.f()}return c}var d,p=Number.POSITIVE_INFINITY,y=u(s);try{for(y.s();!(d=y.n()).done;){var w=d.value;if(p=Math.min(p,S({state:w,alpha:r,beta:n,maxPlayer:i,depth:a-1,maximizing:!0})),n=Math.min(n,p),p<=r)break}}catch(g){y.e(g)}finally{y.f()}return p}function O(t){return T.apply(this,arguments)}function T(){return(T=h(o().mark((function t(e){var r,n,a,s,h,l,c,f,v;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=Number.POSITIVE_INFINITY,n="INITIALIZED",a=u(e.generatePawnMoves(e.pawnPositions[e.currentPlayer]));try{for(a.s();!(s=a.n()).done;)h=s.value,l=i(h.target,2),c=l[0],f=l[1],-1!==(v=e.currentPlayer===b.white?e.board[c][f]:e.board[c-1][f-1])&&v<r&&(r=v,n=g(h.target))}catch(o){a.e(o)}finally{a.f()}return t.abrupt("return",n);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var j,L=function(){function t(e,r,n,i){d(this,t),this.state=void 0,this.n=0,this.v=0,this.parent=void 0,this.children=[],this.untriedActions=void 0,this.move=void 0,this.UCTparam=Math.sqrt(2),this.player=void 0,this.state=e,this.parent=r,this.untriedActions=l(e.legalMoves),this.move=n,this.player=i}return y(t,[{key:"expand",value:function(){var e=this.untriedActions.pop();if(!e)throw new Error("Node is already fully expanded");var r=new t(this.state.makeMove(e),this,e,this.player);return this.children.push(r),r}},{key:"isFullyExpanded",get:function(){return 0===this.untriedActions.length}},{key:"UCT",get:function(){if(null===this.parent||0===this.parent.n)throw new Error("UCT called on root");return 0===this.n?Number.POSITIVE_INFINITY:this.v/this.n+this.UCTparam*Math.sqrt(Math.log(this.parent.n)/this.n)}},{key:"bestChild",value:function(){if(0===this.children.length)throw new Error("MCTSNode has no children");var t,e=[this.children[0]],r=e[0].UCT,n=u(this.children);try{for(n.s();!(t=n.n()).done;){var i=t.value;i.UCT>r?(r=i.UCT,e=[i]):i.UCT===r&&e.push(i)}}catch(a){n.e(a)}finally{n.f()}return N(e)}},{key:"childWithMostVisits",value:function(){if(0===this.children.length)throw new Error("No children to choose from");for(var t=0,e=this.children[0].n,r=1;r<this.children.length;r++)this.children[r].n>e&&(e=this.children[r].n,t=r);return this.children[t]}},{key:"isLeaf",get:function(){return 0===this.children.length}},{key:"isTerminal",get:function(){return!!this.state.isGameOver()||!!this.state.automaticPlayoutPossible}},{key:"rolloutPolicy",value:function(){var t=h(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",E(e,1,null,this.player));case 1:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"rollout",value:function(){var t=h(o().mark((function t(){var e,r,n,i;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.state.clone();case 1:if(e.isGameOver||e.automaticPlayoutPossible){t.next=20;break}if(!e.wallsAvailable[e.currentPlayer]){t.next=9;break}return t.next=5,O(e);case 5:r=t.sent,e=e.makeMoveInplace(r),t.next=18;break;case 9:if(!(Math.random()<.7)){t.next=16;break}return t.next=12,O(e);case 12:n=t.sent,e=e.makeMoveInplace(n),t.next=18;break;case 16:i=N(l(e.legalMoves)),e=e.makeMoveInplace(i);case 18:t.next=1;break;case 20:return t.abrupt("return",e.result(this.player));case 21:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"backpropagate",value:function(t){this.n++,this.v+=t,null!==this.parent&&this.parent.backpropagate(t)}}]),t}(),_=function(){function t(e){d(this,t),this.root=void 0,this.root=new L(e,null,"ROOT",e.currentPlayer)}return y(t,[{key:"select",value:function(){for(var t=this.root;!t.isTerminal;){if(!t.isFullyExpanded)return t.expand();t=t.bestChild()}return t}},{key:"bestAction",value:function(){var t=h(o().mark((function t(){var e,r,n,i,a,s=arguments;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=s.length>0&&void 0!==s[0]?s[0]:1e3,r=0;case 2:if(!(r<e)){t.next=11;break}return n=this.select(),t.next=6,n.rollout();case 6:i=t.sent,n.backpropagate(i);case 8:r++,t.next=2;break;case 11:return a=this.root.childWithMostVisits().move,t.abrupt("return",a);case 13:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()}]),t}();function F(t){return V.apply(this,arguments)}function V(){return(V=h(o().mark((function t(e){var r,n,a,s,h,l,u;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=i(e,3),n=r[0],a=r[1],s=r[2],console.log("received",e),t.prev=2,h=x.fromNotation(n,a),l=new _(h),t.next=7,l.bestAction(s);case 7:u=t.sent,console.log("sent",[u]),postMessage([u]),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(2),console.error(t.t0,n);case 15:case"end":return t.stop()}}),t,null,[[2,12]])})))).apply(this,arguments)}function C(t){var e=i(t,8),r=e[0],n=e[1],a=e[2],o=e[3],s=e[4],h=e[5],l=e[6],u=e[7];try{var c=S({state:x.fromNotation(n,a),alpha:o,beta:s,maxPlayer:h,depth:l,maximizing:u});postMessage([r,c])}catch(f){console.error(f,n)}}!function(t){t.MINMAX="MINMAX",t.MCTS="MCTS"}(j||(j={})),onmessage=function(){var t=h(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:t.t0=e.data[0],t.next=t.t0===j.MINMAX?3:t.t0===j.MCTS?5:7;break;case 3:return C(e.data.splice(1)),t.abrupt("break",8);case 5:return F(e.data.splice(1)),t.abrupt("break",8);case 7:return t.abrupt("break",8);case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}();
//# sourceMappingURL=Worker.6116add7.worker.js.map