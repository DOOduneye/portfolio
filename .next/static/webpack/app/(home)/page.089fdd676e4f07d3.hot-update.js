"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/(home)/page",{

/***/ "(app-pages-browser)/./app/(home)/_components/project-card.tsx":
/*!*************************************************!*\
  !*** ./app/(home)/_components/project-card.tsx ***!
  \*************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ProjectCard: function() { return /* binding */ ProjectCard; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n\nvar _s = $RefreshSig$();\nconst ProjectCard = (param)=>{\n    let { project: { title, description, tags, link } } = param;\n    _s();\n    const controls = useAnimation();\n    const { ref, inView } = useInView();\n    useEffect(()=>{\n        if (inView) {\n            controls.start({\n                y: 0,\n                opacity: 1,\n                transition: {\n                    duration: 0.5,\n                    ease: \"circInOut\"\n                }\n            });\n        }\n    }, [\n        controls,\n        inView\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(motion.div, {\n        ref: ref,\n        initial: {\n            y: 30,\n            opacity: 0\n        },\n        animate: controls,\n        className: \"py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500\",\n        style: {\n            display: \"flex\",\n            flexDirection: \"column\"\n        },\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    flexGrow: 1\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                        className: \"px-4 py-2 text-xl font-bold\",\n                        children: title\n                    }, void 0, false, {\n                        fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n                        lineNumber: 23,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                        className: \"px-4 py-2 text-sm font-normal text-muted-foreground\",\n                        children: description\n                    }, void 0, false, {\n                        fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n                        lineNumber: 24,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n                lineNumber: 22,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex flex-row flex-wrap gap-2 px-4 mt-2 self-end\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        style: {\n                            flex: \"1 0 100%\"\n                        }\n                    }, void 0, false, {\n                        fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n                        lineNumber: 31,\n                        columnNumber: 17\n                    }, undefined),\n                    tags === null || tags === void 0 ? void 0 : tags.map((tag, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Badge, {\n                            variant: \"outline\",\n                            children: tag\n                        }, index, false, {\n                            fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n                            lineNumber: 35,\n                            columnNumber: 21\n                        }, undefined))\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n                lineNumber: 29,\n                columnNumber: 13\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/davidoduneye/projects/dooduneye.github.io/app/(home)/_components/project-card.tsx\",\n        lineNumber: 16,\n        columnNumber: 9\n    }, undefined);\n};\n_s(ProjectCard, \"hfIZHLdLU/wHYEBob1fDEa5Q/ao=\", true);\n_c = ProjectCard;\nvar _c;\n$RefreshReg$(_c, \"ProjectCard\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC8oaG9tZSkvX2NvbXBvbmVudHMvcHJvamVjdC1jYXJkLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQU8sTUFBTUEsY0FBYztRQUFDLEVBQUVDLFNBQVMsRUFBRUMsS0FBSyxFQUFFQyxXQUFXLEVBQUVDLElBQUksRUFBRUMsSUFBSSxFQUFFLEVBQW9COztJQUN6RixNQUFNQyxXQUFXQztJQUNqQixNQUFNLEVBQUVDLEdBQUcsRUFBRUMsTUFBTSxFQUFFLEdBQUdDO0lBRXhCQyxVQUFVO1FBQ04sSUFBSUYsUUFBUTtZQUNSSCxTQUFTTSxLQUFLLENBQUM7Z0JBQ1hDLEdBQUc7Z0JBQ0hDLFNBQVM7Z0JBQ1RDLFlBQVk7b0JBQUVDLFVBQVU7b0JBQUtDLE1BQU07Z0JBQVk7WUFDbkQ7UUFDSjtJQUNKLEdBQUc7UUFBQ1g7UUFBVUc7S0FBTztJQUVyQixxQkFDSSw4REFBQ1MsT0FBT0MsR0FBRztRQUNQWCxLQUFLQTtRQUNMWSxTQUFTO1lBQUVQLEdBQUc7WUFBSUMsU0FBUztRQUFFO1FBQzdCTyxTQUFTZjtRQUNUZ0IsV0FBVTtRQUNWQyxPQUFPO1lBQUVDLFNBQVM7WUFBUUMsZUFBZTtRQUFTOzswQkFDbEQsOERBQUNOO2dCQUFJSSxPQUFPO29CQUFFRyxVQUFVO2dCQUFFOztrQ0FDdEIsOERBQUNDO3dCQUFHTCxXQUFVO2tDQUErQnBCOzs7Ozs7a0NBQzdDLDhEQUFDMEI7d0JBQUVOLFdBQVU7a0NBQ1JuQjs7Ozs7Ozs7Ozs7OzBCQUlULDhEQUFDZ0I7Z0JBQUlHLFdBQVU7O2tDQUVYLDhEQUFDSDt3QkFBSUksT0FBTzs0QkFBRU0sTUFBTTt3QkFBVzs7Ozs7O29CQUc5QnpCLGlCQUFBQSwyQkFBQUEsS0FBTTBCLEdBQUcsQ0FBQyxDQUFDQyxLQUFLQyxzQkFDYiw4REFBQ0M7NEJBQWtCQyxTQUFTO3NDQUFZSDsyQkFBNUJDOzs7Ozs7Ozs7Ozs7Ozs7OztBQUtoQyxFQUFDO0dBdkNZaEM7S0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwLyhob21lKS9fY29tcG9uZW50cy9wcm9qZWN0LWNhcmQudHN4P2Y5NmYiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFByb2plY3RDYXJkID0gKHsgcHJvamVjdDogeyB0aXRsZSwgZGVzY3JpcHRpb24sIHRhZ3MsIGxpbmsgfSB9OiBQcm9qZWN0Q2FyZFByb3BzKSA9PiB7XG4gICAgY29uc3QgY29udHJvbHMgPSB1c2VBbmltYXRpb24oKTtcbiAgICBjb25zdCB7IHJlZiwgaW5WaWV3IH0gPSB1c2VJblZpZXcoKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChpblZpZXcpIHtcbiAgICAgICAgICAgIGNvbnRyb2xzLnN0YXJ0KHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogeyBkdXJhdGlvbjogMC41LCBlYXNlOiAnY2lyY0luT3V0JyB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCBbY29udHJvbHMsIGluVmlld10pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIHJlZj17cmVmfVxuICAgICAgICAgICAgaW5pdGlhbD17eyB5OiAzMCwgb3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17Y29udHJvbHN9XG4gICAgICAgICAgICBjbGFzc05hbWU9J3B5LTUgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwIGVhc2UtaW4tb3V0IHRyYW5zZm9ybSBib3JkZXItMiBib3JkZXItdHJhbnNwYXJlbnQgYm9yZGVyLWdyYXktMjAwIHNoYWRvdy1zbSBkYXJrOmJvcmRlci1ncmF5LTkwMCBkYXJrOmhvdmVyOmJvcmRlci1ncmF5LTMwMCByb3VuZGVkLXhsIGhvdmVyOnNjYWxlLTEwNSBob3Zlcjpib3JkZXItZ3JheS01MDAnXG4gICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPSdweC00IHB5LTIgdGV4dC14bCBmb250LWJvbGQnPnt0aXRsZX08L2gyPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0ncHgtNCBweS0yIHRleHQtc20gZm9udC1ub3JtYWwgdGV4dC1tdXRlZC1mb3JlZ3JvdW5kJz5cbiAgICAgICAgICAgICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmxleCBmbGV4LXJvdyBmbGV4LXdyYXAgZ2FwLTIgcHgtNCBtdC0yIHNlbGYtZW5kJz5cbiAgICAgICAgICAgICAgICB7LyogRW1wdHkgZGl2IHRvIGNyZWF0ZSBzcGFjZSAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6ICcxIDAgMTAwJScgfX0+PC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogVGFncyAqL31cbiAgICAgICAgICAgICAgICB7dGFncz8ubWFwKCh0YWcsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxCYWRnZSBrZXk9e2luZGV4fSB2YXJpYW50PXsnb3V0bGluZSd9Pnt0YWd9PC9CYWRnZT5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgKVxufVxuIl0sIm5hbWVzIjpbIlByb2plY3RDYXJkIiwicHJvamVjdCIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJ0YWdzIiwibGluayIsImNvbnRyb2xzIiwidXNlQW5pbWF0aW9uIiwicmVmIiwiaW5WaWV3IiwidXNlSW5WaWV3IiwidXNlRWZmZWN0Iiwic3RhcnQiLCJ5Iiwib3BhY2l0eSIsInRyYW5zaXRpb24iLCJkdXJhdGlvbiIsImVhc2UiLCJtb3Rpb24iLCJkaXYiLCJpbml0aWFsIiwiYW5pbWF0ZSIsImNsYXNzTmFtZSIsInN0eWxlIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJmbGV4R3JvdyIsImgyIiwicCIsImZsZXgiLCJtYXAiLCJ0YWciLCJpbmRleCIsIkJhZGdlIiwidmFyaWFudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/(home)/_components/project-card.tsx\n"));

/***/ })

});