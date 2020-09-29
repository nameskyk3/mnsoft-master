package com.mobigen.framework.service.excel;

import com.mobigen.framework.component.Messages;
import com.mobigen.framework.security.SessionManager;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.HashMap;

@Slf4j
@Controller
@RequestMapping(value = "/service/excel")
public class ExcelController {

    @Autowired
    private SessionManager sessionManager;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private Messages message;

    @ApiResponses(value = {@ApiResponse(code = 200, message = "ok")})
    @RequestMapping(value = "/alarm/definitions", method = RequestMethod.GET)
    public void getAlarmDefinitionList(HttpServletResponse response, @NotNull @ApiParam(value = "알람 아이디", required = true) @Valid @RequestParam HashMap param) throws Exception {
//        RestUtil restUtil = new RestUtil();
//        JsonResult js = new JsonResult();
//
//        String columnUrl = Constants.ORCHESTRATION_URL + "/orchestration/v1/alarm/definitions/excel/header";
//        String dataUrl = Constants.ORCHESTRATION_URL + "/orchestration/v1/alarm/definitions";
//        JsonResult columnResult = (JsonResult) restUtil.getJson(columnUrl, param);      //저장할 헤더 정보
//        JsonResult dataResult = (JsonResult) restUtil.getJson(dataUrl, param);          // 저장할 데이터 정보
//
//        ServletOutputStream out = null;
//        HashMap columnMap = (HashMap)columnResult.getData();
//
//        try {
//            List<Object> excelData = (List<Object>)dataResult.getData();
//            List<String> selected = getSelectedIds(param);
//
//            // 1. 일반
//            ExcelUtil excel = new ExcelUtil("일반");
//            ArrayList infoColumns = (ArrayList) columnMap.get("info");
//            parsingAlarmInfo(excel, infoColumns, excelData, selected);
//
//            // 2. 상세
//            excel.addSheet("상세");
//            ArrayList detailColumns = (ArrayList) columnMap.get("detail");
//            parsingAlarmDetail(excel, detailColumns, excelData, selected);
//
//            // 3. 파일 다운로드
//            String fileName = commonService.getExcelFileName("alarm-definition");
//            log.info(fileName);
//            response.reset();
//            response.setContentType("application/vnd.ms-excel:UTF-8");
//            response.setHeader("Content-Disposition", "attachment; filename=" + fileName + ".xls" + ";");
//            out = response.getOutputStream();
//            excel.write(out);
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//        } finally {
//            if (out != null)
//                out.close();
//        }
    }
}
