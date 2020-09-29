<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'default-component',
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
      treeSource: [{
        groupId: 0,
        groupName: '1뎁스',
        children: [
          {groupId: 1, groupName: '부서1'},
          {groupId: 2,
            groupName: '부서2',
            children: [
              {groupId: 5, groupName: '2뎁스1'},
              {groupId: 6, groupName: '3뎁스2'},
              {groupId: 7, groupName: '3뎁스3'}
            ]},
          {groupId: 3, groupName: '부서3'},
          {groupId: 4, groupName: '부서4'}
        ]
      }],
      activeItemObj: {}, // 활성화 시킬 객체
      selectedItemList: [] // 선택시킬 객체
    }
  },
  computed: {
  },
  methods: {
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
