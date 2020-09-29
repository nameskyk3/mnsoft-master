<template>
  <div style="width:650px; height:300px">
    <ag-grid-vue style="width:100%; height:100%" class="ag-theme-balham"
                 :gridOptions="gridOptions"
                 :columnDefs="columnDefs"
                 :rowData="rowDataList"
    ></ag-grid-vue>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'test-list',
  components: {
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
    this.getTestList()
  },
  props: {
  },
  data () {
    return {
      rowData: [
      ],
      gridOptions: {
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        animateRows: false
      }
    }
  },
  computed: {
    columnDefs () {
      return [
        {headerName: '컬럼1', field: 'column1'},
        {headerName: '컬럼2', field: 'column2'}
      ]
    },
    rowDataList () {
      return this.rowData
    }
  },
  methods: {
    getTestList () {
      axios.get('/test/list').then(response => {
        console.log(response.data.data)
        this.rowData = response.data.data
      })
    }
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
