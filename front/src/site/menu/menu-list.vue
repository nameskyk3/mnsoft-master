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
  name: 'menu-list',
  components: {
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
    this.getMenuList()
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
        {headerName: '메뉴 번호', field: 'menNum'},
        {headerName: '상위 메뉴 번호', field: 'menParent'},
        {headerName: '메뉴 이름', field: 'menName'}
      ]
    },
    rowDataList () {
      return this.rowData
    }
  },
  methods: {
    getMenuList () {
      axios.get('/menu/list').then(response => {
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
