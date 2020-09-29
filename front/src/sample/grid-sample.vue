<template>
  <div style="width:650px; height:300px">
    <ag-grid-vue style="width:100%; height:100%" class="ag-theme-balham"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="rowData"
    ></ag-grid-vue>
  </div>
</template>

<script>
export default {
  name: 'grid-sample',
  components: {
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
  },
  props: {
  },
  data () {
    return {
      rowData: [
        {make: '현대', model: '아반떼', grade: '준중형', price: 2000},
        {make: '현대', model: '산타페', grade: '중형', price: 3500},
        {make: '현대', model: '소나타', grade: '중형', price: 3000},
        {make: '현대', model: '그랜저', grade: '준대형', price: 4000},
        {make: '기아', model: 'K3', grade: '준중형', price: 2000},
        {make: '기아', model: 'K5', grade: '중형', price: 3000},
        {make: '기아', model: 'K7', grade: '준대형', price: 4000}
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
        {headerName: '생산자', field: 'make'},
        {headerName: '자동차명', field: 'model'},
        {headerName: '중고가격', field: 'price'}
      ]
    }
  },
  methods: {

  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
