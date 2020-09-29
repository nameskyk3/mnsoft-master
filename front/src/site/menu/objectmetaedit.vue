<template>
    <div class="contentmetainput">
      <div class="treeareage">
        <ul style="background-color: #b7e4ff">
          <li style="margin: 0;list-style: none;width: 100%;height: 35px;text-align: center;line-height: 35px;">
            <span>콘텐츠명</span>
            <input type="text" style="width: 170px;margin-top: -8px;" />
            <button style="margin-top: -8px;text-align: center;height: 25px;line-height: 25px;">조회</button>
          </li>
        </ul>
        <ul style="background-color: #b7e4ff;margin-top: -12px;width: 100%;height: 95.3%;">
          <li style="font-size: 9pt;float: right"><button>전체열기</button><button>전체닫기</button></li>
          <li>
            <div>
              <msf-tree :source="treeSource"
                        :activeItem="activeItemObj"
                        :selectedList="selectedItemList"
                        id-field="groupId"
                        label-field="groupName"
                        ref="tree"
                        @itemClick="treeItemClick"
                        style="width:100%; height:100%;font-size: 12pt;"
              ></msf-tree>
            </div>
          </li>
        </ul>
      </div>
      <div class="metaareage" >
        <div style="width: 85%;height:89%;float: left" id="resizeDiv">
          <ul style="width: 100%;height: 67%;margin-bottom: 2px;">
            <canvas ref="canvas" style="width: 100%;height: 100%;border:1px solid;"></canvas>
          </ul>
          <ul style="margin-bottom: 2px;">
            <div style="width: 100%;height: 30px;border: 1px solid lightcoral;text-align: center;font-weight: bold;">{{ this.pointeLocation }}</div>
          </ul>
          <ul style="width: 100%;height: 230px;border:1px solid black;margin-bottom: 2px;">
            <div style="width: 100%;height: 110px;border: 1px solid lightcoral;">
              <li v-for="(d, i) in gridTarget[this.selectRow].option" :key="i" v-if="i<10 && childrenView" @click="addObject(d)" style="float: left;width: 9.9%;background-color: #00b40b;margin-left: 1px;height: 100%;">
                <img :src="d.imgurl" width="134px" height="108px" />
              </li>
            </div>
            <div style="width: 100%;height: 110px;border: 1px solid lightcoral;margin-top: 8px;">
              <li v-for="(d, i) in gridTarget[this.selectRow].option.slice(10)" :key="i" v-if="i<10 && childrenView" @click="addObject(d)" style="float: left;width: 9.9%;background-color: #00b40b;margin-left: 1px;height: 100%;">
                <img :src="d.imgurl" width="134px" height="108px" />
              </li>
            </div>
          </ul>
        </div>
        <div style="float: left;width: 14%;height:91%;border: 1px solid black;margin-left: 5px;">
          <ag-grid-vue style="width:100%; height:100%;" class="ag-theme-balham" v-if="gridView"
                       :gridOptions="gridOptions"
                       :columnDefs="columnDefs"
                       :rowData="gridTarget"
                       @grid-read="onGridReady"
                       @cellClicked="getSelectedRows">
          </ag-grid-vue>
        </div>
        <div>
          <ul style="margin: 0;">
            <li class="treeli"><button @click="opsitionSave">좌표저장</button></li>
            <li style="float:left;width: 20%;margin-left: 2px;font-size: 13pt;height: 100%;text-align: center;font-weight: bold;padding-top: 55px;">현재 페이지 : 10 / 100</li>
            <li class="treeli"><button @click="onClickPaging('f')">이전페이지</button></li>
            <li class="treeli"><button @click="onClickPaging('n')">다음페이지</button></li>
            <li class="treeli"><button @click="onBogan">보간</button></li>
            <li class="treeli"><button>미리보기</button></li>
            <li class="treeli"><button>편집시작</button></li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
import MsfTree from '@/common/component/tree/msf-tree'
let canvas
let ctx
export default {
  components: {MsfTree},
  data () {
    return {
      gridApi: '',
      columnApi: '',
      srcBackground: '',
      contentOffsetX: 0,
      contentOffsetY: 0,
      contentHeight: 0,
      contentWidth: 0,
      inSrcBackground: '',
      inContentOffsetX: 0,
      inContentOffsetY: 0,
      inContentWidth: 0,
      inContentHeight: 0,
      diffX: 0,
      diffY: 0,
      imageLoad: false,
      WIDTH: 0,
      HEIGHT: 0,
      imgBackground: new Image(),
      canvasValid: false,
      drawObject: [],
      mySel: null,
      CIRCLE: '',
      RECT: '',
      IMAGE: '',
      mySelLineWidth: 0,
      mySelLineColor: '',
      isDrag: false,
      stylePaddingLeft: '',
      stylePaddingTop: '',
      styleBorderLeft: '',
      styleBorderTop: '',
      mx: 0,
      my: 0,
      selectRow: 0,
      callbackPrintSelObjInfoFun: null,
      type: 1,
      objName: '',
      gridView: false,
      childrenView: false,
      imgView: false,
      targetViewImageW: 0,
      targetViewImageH: 0,
      gridTarget: [
        {objectName: '',
          objectImage: '',
          option: []
        }
      ],
      pointeLocation: 'test location',
      treeSource: [
        {
          groupId: 0,
          groupName: 'Flower',
          children: [
            {groupId: 1, groupName: 'CONTENT001_1.mp4', listName: 'fullList', targetImgwidth: 0, targetImgheight: 0}
          ]
        },
        {
          groupId: 2,
          groupName: 'Tent',
          children: [
            {groupId: 3, groupName: 'CONTENT002_1.mp4', listName: 'tentList', targetImgwidth: 900, targetImgheight: 0}
          ]
        }
      ],
      activeItemObj: {}, // 활성화 시킬 객체
      selectedItemList: [], // 선택시킬 객체
      gridOptions: {
        enableColResize: true,
        animateRows: false,
        rowSelection: 'single'
      },
      fullList: [
        {objectName: 'flowerList1',
          objectImage: require('@/asset/images/bg_fllow.jpg'),
          option: [
            {mvId: 'flower1', fx: 392, fy: 285, fw: 240, fh: 250, fill: 'red', ststyle: 'red', linew: 3, ftext: '1', imgurl: require('@/asset/images/f1/fm_1_1.jpg')},
            {mvId: 'flower2', fx: 907, fy: 331, fw: 240, fh: 250, fill: 'red', ststyle: 'red', linew: 3, ftext: '2', imgurl: require('@/asset/images/f1/fm_1_2.jpg')},
            {mvId: 'flower3', fx: 1546, fy: 68, fw: 100, fh: 100, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_3.jpg')},
            {mvId: 'flower4', fx: 1270, fy: 275, fw: 240, fh: 250, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_4.jpg')},
            {mvId: 'flower5', fx: 0, fy: 591, fw: 180, fh: 120, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_5.jpg')},
            {mvId: 'flower6', fx: 1656, fy: 102, fw: 100, fh: 100, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_6.jpg')},
            {mvId: 'flower7', fx: 1119, fy: 69, fw: 100, fh: 120, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_7.jpg')},
            {mvId: 'flower8', fx: 785, fy: 63, fw: 100, fh: 100, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_8.jpg')},
            {mvId: 'flower9', fx: 0, fy: 0, fw: 200, fh: 200, fill: 'black', ststyle: 'black', linew: 3, ftext: '3', imgurl: require('@/asset/images/noImage.jpg')},
            {mvId: 'flower10', fx: 0, fy: 0, fw: 200, fh: 200, fill: 'black', ststyle: 'black', linew: 3, ftext: '3', imgurl: require('@/asset/images/noImage.jpg')},
            {mvId: 'flower11', fx: 1265, fy: 22, fw: 120, fh: 120, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_11.jpg')},
            {mvId: 'flower12', fx: 623, fy: 387, fw: 110, fh: 110, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_12.jpg')},
            {mvId: 'flower13', fx: 252, fy: 59, fw: 90, fh: 100, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/f1/fm_1_13.jpg')}
          ]
        },
        {objectName: 'flowerList2',
          objectImage: require('@/asset/images/bg_fllow.jpg'),
          option: [
            {mvId: 'flower11', fx: 392, fy: 285, fw: 240, fh: 250, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '1', imgurl: require('@/asset/images/f2/fm_2_1.jpg')},
            {mvId: 'flower22', fx: 907, fy: 331, fw: 240, fh: 250, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '2', imgurl: require('@/asset/images/f2/fm_2_2.jpg')},
            {mvId: 'flower33', fx: 1546, fy: 68, fw: 100, fh: 100, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_3.jpg')},
            {mvId: 'flower44', fx: 1119, fy: 69, fw: 100, fh: 120, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_4.jpg')},
            {mvId: 'flower55', fx: 0, fy: 591, fw: 180, fh: 120, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_5.jpg')},
            {mvId: 'flower66', fx: 785, fy: 63, fw: 100, fh: 100, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_6.jpg')},
            {mvId: 'flower77', fx: 252, fy: 59, fw: 90, fh: 100, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_7.jpg')},
            {mvId: 'flower88', fx: 1265, fy: 22, fw: 120, fh: 120, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_8.jpg')},
            {mvId: 'flower99', fx: 0, fy: 0, fw: 200, fh: 200, fill: 'black', ststyle: 'black', linew: 3, ftext: '3', imgurl: require('@/asset/images/noImage.jpg')},
            {mvId: 'flower110', fx: 0, fy: 0, fw: 200, fh: 200, fill: 'black', ststyle: 'black', linew: 3, ftext: '3', imgurl: require('@/asset/images/noImage.jpg')},
            {mvId: 'flower111', fx: 623, fy: 387, fw: 110, fh: 110, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_11.jpg')},
            {mvId: 'flower112', fx: 1656, fy: 102, fw: 100, fh: 100, fill: 'blue', ststyle: 'blue', linew: 3, ftext: '3', imgurl: require('@/asset/images/f2/fm_2_12.jpg')}
          ]
        },
        {objectName: 'flowerList3',
          objectImage: require('@/asset/images/bg_fllow.jpg'),
          option: [
            {mvId: 'flower111', fx: 392, fy: 285, fw: 240, fh: 250, fill: 'green', ststyle: 'green', linew: 3, ftext: '1', imgurl: require('@/asset/images/f3/fm_3_1.jpg')},
            {mvId: 'flower222', fx: 907, fy: 331, fw: 240, fh: 250, fill: 'green', ststyle: 'green', linew: 3, ftext: '2', imgurl: require('@/asset/images/f3/fm_3_2.jpg')},
            {mvId: 'flower333', fx: 1546, fy: 68, fw: 100, fh: 100, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_3.jpg')},
            {mvId: 'flower444', fx: 1656, fy: 102, fw: 100, fh: 100, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_4.jpg')},
            {mvId: 'flower555', fx: 623, fy: 387, fw: 110, fh: 110, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_5.jpg')},
            {mvId: 'flower666', fx: 0, fy: 0, fw: 200, fh: 200, fill: 'black', ststyle: 'black', linew: 3, ftext: '3', imgurl: require('@/asset/images/noImage.jpg')},
            {mvId: 'flower777', fx: 0, fy: 0, fw: 200, fh: 200, fill: 'black', ststyle: 'black', linew: 3, ftext: '3', imgurl: require('@/asset/images/noImage.jpg')},
            {mvId: 'flower888', fx: 1265, fy: 22, fw: 120, fh: 120, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_6.jpg')},
            {mvId: 'flower999', fx: 252, fy: 59, fw: 90, fh: 100, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_7.jpg')},
            {mvId: 'flower1110', fx: 785, fy: 63, fw: 100, fh: 100, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_8.jpg')},
            {mvId: 'flower1111', fx: 1119, fy: 69, fw: 100, fh: 120, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_9.jpg')},
            {mvId: 'flower1113', fx: 0, fy: 591, fw: 180, fh: 120, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_10.jpg')},
            {mvId: 'flower1114', fx: 1270, fy: 275, fw: 240, fh: 250, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_11.jpg')},
            {mvId: 'flower1115', fx: 57, fy: 757, fw: 200, fh: 160, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_12.jpg')},
            {mvId: 'flower1116', fx: 1147, fy: 683, fw: 100, fh: 100, fill: 'green', ststyle: 'green', linew: 3, ftext: '3', imgurl: require('@/asset/images/f3/fm_3_13.jpg')}
          ]
        }
      ],
      tentList: [
        {objectName: 'tentList1',
          objectImage: require('@/asset/images/tenteview.jpg'),
          option: [
            {mvId: 'tent1', fx: 1700, fy: 526, fw: 220, fh: 230, fill: 'red', ststyle: 'red', linew: 3, ftext: '1', imgurl: require('@/asset/images/tent1/tent_1_1.jpg')},
            {mvId: 'tent2', fx: 647, fy: 455, fw: 480, fh: 280, fill: 'red', ststyle: 'red', linew: 3, ftext: '2', imgurl: require('@/asset/images/tent1/tent_1_2.jpg')},
            {mvId: 'tent3', fx: 308, fy: 493, fw: 200, fh: 180, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/tent1/tent_1_3.jpg')}
          ]
        },
        {objectName: 'tentList2',
          objectImage: require('@/asset/images/tenteview.jpg'),
          option: [
            {mvId: 'tent2-1', fx: 1493, fy: 459, fw: 110, fh: 130, fill: 'red', ststyle: 'red', linew: 3, ftext: '1', imgurl: require('@/asset/images/tent2/tent_2_1.jpg')},
            {mvId: 'tent2-2', fx: 1341, fy: 396, fw: 110, fh: 130, fill: 'red', ststyle: 'red', linew: 3, ftext: '2', imgurl: require('@/asset/images/tent2/tent_2_2.jpg')},
            {mvId: 'tent2-3', fx: 2682, fy: 345, fw: 110, fh: 130, fill: 'red', ststyle: 'red', linew: 3, ftext: '3', imgurl: require('@/asset/images/tent2/tent_2_3.jpg')}
          ]
        }
      ]
    }
  },
  methods: {
    onGridReady (params) {
      debugger
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.rowData = this.listName
    },
    getSelectedRows (params) {
      this.selectRow = params.rowIndex
      this.childrenView = true
      this.imgView = true
      this.canvasView()
    },
    setBackground () {
      this.srcBackground = this.inSrcBackground
      this.contentOffsetX = this.inContentOffsetX
      this.contentOffsetY = this.inContentOffsetY
      this.contentWidth = this.inContentWidth
      this.contentHeight = this.inContentHeight
      this.diffX = (this.contentWidth) / this.WIDTH
      this.diffY = (this.contentHeight) / this.HEIGHT
      this.imageLoad = false

      this.imgBackground.src = this.srcBackground
      canvas = this.$refs.canvas
      ctx = canvas.getContext('2d')

      this.imgBackground.onload = () => {
        this.clearCanvas(ctx)
        this.backgroundDraw(ctx)
        this.draw()
        // ctx.drawImage(this.imgBackground, this.contentOffsetX, this.contentOffsetY, this.inContentWidth, this.inContentHeight, 0, 0, 310, 180)
        // b:보여줄 이미지의 x좌표 c:보여줄 이미지의 y좌표
        // d:0이면 이미지가 안나옴 e:0이면 이미지가 안나옴 값을 올리면 zoom기능 d를 높이면 이미지 가로가 길어지고 e를 낮추면 이미지 하단이 내려감, 1940, 1350
        // f:프레임 x위치시점 g:프레임 y위치 시점
        // h:화면에 보이는 widht i: 화면에 보이는 height
      }
    },
    clearCanvas (ctx) {
      if (this.CIRCLE !== '' && this.RECT !== '') {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    },
    backgroundDraw (ctx) {
      ctx.drawImage(this.imgBackground, this.contentOffsetX, this.contentOffsetY, this.contentWidth, this.contentHeight, 0, 0, this.WIDTH, this.HEIGHT)
    },
    draw () {
      if (this.canvasValid === false) {
        this.clearCanvas(ctx)
        this.backgroundDraw(ctx)

        let l = this.drawObject.length
        for (let i = 0; i < l; i++) {
          this.shapeDraw(ctx, this.drawObject[i])
        }

        if (this.mySel !== null) {
          if (this.mySel.type === this.CIRCLE) {
            ctx.beginPath()
            ctx.arc((this.mySel.x - this.contentOffsetX) / this.diffX
              , (this.mySel.y - this.contentOffsetY) / this.diffY
              , this.mySel.hw / this.diffX, 0, (Math.PI / 180) * 360, false)

            ctx.lineWidth = this.mySelLineWidth
            ctx.strokeStyle = this.mySelLineColor
            ctx.stroke()
          } else if (this.mySel.type === this.RECT) {
            ctx.lineWidth = this.mySelLineWidth
            ctx.strokeStyle = this.mySelLineColor
            ctx.strokeRect((this.mySel.x - this.contentOffsetX) / this.diffX, (this.mySel.y - this.contentOffsetY) / this.diffY, this.mySel.w / this.diffX, this.mySel.h / this.diffY)
          } else {
            console.log('=================미구현=================')
          }
        }

        this.canvasValid = true
      }
    },
    shapeDraw (ctx, drawObject) {
      if (drawObject.type === this.CIRCLE) {
        ctx.beginPath()
        ctx.arc((drawObject.x - this.contentOffsetX) / this.diffX
          , (drawObject.y - this.contentOffsetY) / this.diffY
          , (drawObject.hw / this.diffX, 0, (Math.PI / 180) * 360, false))
        ctx.closePath()
        ctx.fillStyle = drawObject.fill
        ctx.fill()
        ctx.font = (drawObject.hw / this.diffX) + 'px Arial bold'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'white'
        ctx.fillText(drawObject.text
          , (drawObject.x - this.contentOffsetX) / this.diffX
          , (drawObject.y - this.contentOffsetY) / this.diffY)
      } else if (drawObject.type === this.RECT) {
        ctx.strokeStyle = drawObject.strokeStyle
        ctx.lineWidth = drawObject.lineWidth
        ctx.strokeRect((drawObject.x - this.contentOffsetX) / this.diffX
          , (drawObject.y - this.contentOffsetY) / this.diffY
          , drawObject.w / this.diffX, drawObject.h / this.diffY)
      } else {
        alert('객체 type error')
        return false
      }

      if (this.mySel !== null) {
        // callbackPrintSelObjInfoFun(this.mySel);
        this.pointeLocation = 'X mySel: ' + this.mySel.x + ' - Y mySel :' + this.mySel.y + ' - W mySel: ' + this.mySel.w + ' - H mySel :' + this.mySel.h + ' - mx: ' + this.mx + ' - my :' + this.my
      }
    },
    initCanvas () {
      this.mySelLineColor = 'yellow'
      this.mySelLineWidth = 5

      canvas = this.$refs.canvas
      ctx = canvas.getContext('2d')
      canvas.height = canvas.clientHeight
      canvas.width = canvas.clientWidth
      this.HEIGHT = canvas.height
      this.WIDTH = canvas.width
      this.isDrag = false
      this.canvasValid = false
      // canvas 객체 및 canvas context 설정 및 속설 설정 -- 종료

      // canvas의 모든 객체 초기화(삭제)
      this.drawObject = []
      this.mySel = null

      // canvas 초기화
      this.clearCanvas(ctx)
      // fixes a problem where double clicking causes text to get selected on the canvas
      canvas.onselectstart = () => { return false }

      // fixes mouse co-ordinate problems when there's a border or padding
      // see getMouse for more detail
      if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0
        this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0
        this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0
        this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0
      }

      // make draw() fire every INTERVAL milliseconds.
      // setInterval(draw, INTERVAL);

      // add our events. Up and down are for dragging,
      // double click is for making new drawObject
      canvas.onmousedown = this.mouseDown
      canvas.onmouseup = this.mouseUp
      canvas.onmouseout = this.mouseOut
    },
    mouseDown (e) {
      this.getMouse(e)
      // run through all the drawObject
      let l = this.drawObject.length - 1
      for (let i = l; i >= 0; i--) {
        if (this.isPointInRectangle(this.mx, this.my, this.drawObject[i])) {
          this.mySel = this.drawObject[i]
          this.offsetx = this.mx - this.mySel.x
          this.offsety = this.my - this.mySel.y
          this.mySel.x = this.mx - this.offsetx
          this.mySel.y = this.my - this.offsety

          this.isDrag = true
          canvas.onmousemove = this.mouseMove
          return false
        }
      }
      // havent returned means we have selected nothing
      this.mySel = null
    },
    getMouse (e) {
      this.mx = e.offsetX * this.diffX + this.contentOffsetX
      this.my = e.offsetY * this.diffY + this.contentOffsetY
    },
    isPointInRectangle (x, y, drawObject) {
      if (drawObject.type === this.CIRCLE) {
        return (x > drawObject.x - drawObject.hw && x < drawObject.x + drawObject.hw && y > drawObject.y - drawObject.hw && y < drawObject.y + drawObject.hw)
      } else if (drawObject.type === this.RECT) {
        return (x > drawObject.x && x < drawObject.x + drawObject.w && y > drawObject.y && y < drawObject.y + drawObject.h)
      }
    },
    mouseMove (e) {
      if (this.isDrag) {
        this.getMouse(e)
        this.mySel.x = this.mx - this.offsetx
        this.mySel.y = this.my - this.offsety

        if (this.mySel !== null) {
          if (this.mySel.x - this.contentOffsetX <= 0) {
            this.mySel.x = this.contentOffsetX
          }
          if (this.mySel.y - this.contentOffsetY <= 0) {
            this.mySel.y = this.contentOffsetY
          }

          if (this.mySel.type === this.CIRCLE) {
            if (this.mySel.y - this.contentOffsetY >= this.HEIGHT * this.diffY) {
              this.mySel.y = this.HEIGHT * this.diffY + this.contentOffsetY
            }

            if (this.mySel.x - this.contentOffsetX >= this.WIDTH * this.diffX) {
              this.mySel.x = this.WIDTH * this.diffX + this.contentOffsetX
            }
          } else {
            if (this.mySel.y - this.contentOffsetY + this.mySel.h >= this.HEIGHT * this.diffY) {
              this.mySel.y = this.HEIGHT * this.diffY - this.mySel.h + this.contentOffsetY
            }

            if (this.mySel.x - this.contentOffsetX + this.mySel.w >= this.WIDTH * this.diffX) {
              this.mySel.x = this.WIDTH * this.diffX - this.mySel.w + this.contentOffsetX
            }
          }
        }
        // something is changing position so we better invalidate the canvas!
        this.invalidate()
      }
    },
    mouseUp () {
      this.isDrag = false
      canvas.onmousemove = null
    },
    mouseOut () {
      this.mouseUp()
      if (this.mySel !== null) {
        if (this.mySel.x - this.contentOffsetX <= 0) {
          this.mySel.x = this.contentOffsetX
        }

        if (this.mySel.y - this.contentOffsetY <= 0) {
          this.mySel.y = this.contentOffsetY
        }
        if (this.mySel.type === this.CIRCLE) {
          if (this.mySel.y - this.contentOffsetY >= this.HEIGHT * this.diffY) {
            this.mySel.y = this.HEIGHT * this.diffY + this.contentOffsetY
          }
          if (this.mySel.x - this.contentOffsetX >= this.WIDTH * this.diffX) {
            this.mySel.x = this.WIDTH * this.diffX + this.contentOffsetX
          }
        } else {
          if (this.mySel.y - this.contentOffsetY + this.mySel.h >= this.HEIGHT * this.diffY) {
            this.mySel.y = this.HEIGHT * this.diffY + this.contentOffsetY - this.mySel.h
          }
          if (this.mySel.x - this.contentOffsetX + this.mySel.w >= this.WIDTH * this.diffX) {
            this.mySel.x = this.WIDTH * this.diffX + this.contentOffsetX - this.mySel.w
          }
        }
        this.invalidate()
      }
    },
    invalidate () {
      this.draw()
      this.canvasValid = false
    },
    canvasView () {
      this.initCanvas()
      this.inContentOffsetX = this.targetViewImageW // 4960
      this.inContentOffsetY = this.targetViewImageH // 640
      this.inContentWidth = 1920
      this.inContentHeight = 1080
      this.inSrcBackground = this.gridTarget[this.selectRow].objectImage
      this.setBackground()
    },
    addObject (params) {
      this.RECT = 'rect'
      this.canvasValid = false
      // console.log(' params.fx : ' + params.fx + ' params.fy : ' + params.fy + ' params.fw : ' + params.fw + ' params.fh : ' + params.fh + ' params.fill : ' + params.fill + ' params.ststyle : ' + params.ststyle)
      this.pointeLocation = 'X mySel: ' + params.fx + ' - Y mySel :' + params.fy + ' - W mySel: ' + params.fw + ' - H mySel :' + params.fh + ' - mx: ' + this.mx + ' - my :' + this.my
      this.addObjectRect(params.fx, params.fy, params.fw, params.fh, params.fill, params.ststyle, params.linew, params.ftext)
    },
    addObjectRect (x, y, w, h, fill, strokeStyle, lineWidth, text) {
      let objectRect = {
        x: x,
        y: y,
        w: w,
        h: h,
        fill: fill,
        strokeStyle: strokeStyle,
        lineWidth: lineWidth,
        type: this.RECT,
        text: text
      }

      this.drawObject.push(objectRect)
      this.invalidate()
    },
    addObjectCircle (x, y, hw, fill, strokeStyle, lineWidth, text) {
      let objectCircle = {
        x: x,
        y: y,
        w: hw * 2,
        h: hw * 2,
        fill: fill,
        strokeStyle: strokeStyle,
        lineWidth: lineWidth,
        type: this.CIRCLE,
        text: text
      }
      this.drawObject.push(objectCircle)
      this.invalidate()
    },
    opsitionSave () {
      alert('좌표가 저장되었습니다 - ex')
    },
    onClickPaging (param) {
      alert(param + '페이지 이동 합니다')
    },
    onBogan () {
      alert('보간 페이지를 호출 합니다.')
    },
    treeItemClick ($event) {
      if (this.activeItemObj) { this.selectedItemList.push(this.activeItemObj) }// 제거는 빼면 됨
      this.activeItemObj = $event
      let targetN = $event.listName
      this.clearView()

      if (targetN === 'fullList') {
        this.gridTarget = this.fullList
      } else if (targetN === 'tentList') {
        this.gridTarget = this.tentList
      }

      this.gridView = true
    },
    clearView () {
      this.childrenView = false

      if (this.imgView === true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
      }
    }
  },
  mounted () {
    // this.canvasView()
    // this.selectRow = 0
  },
  computed: {
    columnDefs () {
      return [
        {headerName: '목록', field: 'objectName', sortable: true}
      ]
    }
  }
}
</script>
<style scoped>
  html, body {
    margin:0;
    height:100%;
    overflow: hidden;
  }
  .treeareage {
    float: left;
    width:300px;
    height: 850px;
    margin: 0;
    background-color: #9eabfd;
    border: 1px solid black;
  }
  .metaareage{
    float: left;
    height: 850px;
    width: 1610px;
    background-color: #9eabfd;
    margin-left: 10px;
  }
  .treeli{
    float: left;
    width: 13%;
    margin: 0 2px 0 2px;
    height: 100%;
    line-height: 100%;
    text-align: center;
  }
  .treeli button {
    font-size: 15pt;
    height: 40px;
    margin-top: 35px;
  }
  .canvas {
    border: 1px solid #000;
    width: 100%;
    height: 100%;
  }
  #resizeDiv {resize: vertical}
</style>
