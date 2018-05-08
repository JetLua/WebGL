import Vue from 'vue'
import * as core from '../core/index'

new Vue({
    data: {
        index: 0,
        list: [
            '纹理贴图',
            '待添加...'
        ]
    },

    methods: {
        handle(i:number) {
            this.index = i
            switch (i) {
                case 0:
                    import('../components/texture')
                    break
            }
        }
    },

    mounted() {
        core.init()
        import('../components/texture')
    }
}).$mount('.app')