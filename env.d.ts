// <reference types="vite/client" />
// vue3 报错提示 找不到模块“./XXX.vue”或其相应的类型声明
// 报错原因：typescript 只能理解 .ts 文件，无法理解 .vue文件
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// interface ImportMetaEnv {
//     readonly VITE_APP_TITLE: string
//     // 更多环境变量...
// }

interface ImportMeta {
    readonly env: ImportMetaEnv
}