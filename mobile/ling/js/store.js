const store = new Vuex.Store({
    state: {
        tabIdx: 3,
        tabName: "books"
    },
    mutations: {
        changTabIdx(state, idx) {
            state.tabIdx = idx;
            switch (idx) {
                case 0:
                    state.tabName = 'index';
                    break;
                case 1:
                    state.tabName = 'sort';
                    break;
                case 2:
                    //state.tabName = 'index';
                    break;
                case 3:
                    state.tabName = 'books';
                    break;
            }
        }
    }
});