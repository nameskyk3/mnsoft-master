package com.mobigen.framework.service.excel;

import com.mobigen.framework.result.UnderscoreToCamelMap;
import com.mobigen.framework.service.excel.model.ExcelRequest;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.*;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class ExcelService {

    @SuppressWarnings("unchecked")
    public XSSFWorkbook makeExcelData(ExcelRequest parameter, List<Object> excelData) throws Exception {

        if (excelData == null)
            return null;

        XSSFWorkbook xswk = new XSSFWorkbook();
        XSSFFont headerFont = getDefaultFont(xswk, "Arial", true);
        XSSFFont cellFont = getDefaultFont(xswk, "굴림", false);
        CellStyle headerStyle = getDefaultCellStyle(xswk, headerFont, HSSFColor.GREY_25_PERCENT.index);
        CellStyle cellStyle = getDefaultCellStyle(xswk, cellFont, HSSFColor.WHITE.index);

        XSSFSheet xss = xswk.createSheet();
        xswk.setSheetName(0, parameter.getFileName());

        XSSFRow row = null;
        XSSFCell cell = null;

        List<Map<String, Object>> headers = parameter.getHeaders();

        int l = excelData.size();
        for (int i = 0; i < l; i++) {
            row = xss.createRow(0);

            int hl = headers.size();
            for (int j = 0; j < hl; j++) {
                cell = row.createCell(j);
                cell.setCellValue(URLDecoder.decode((String) headers.get(j).get("headerName"), "utf-8"));
                cell.setCellStyle(headerStyle);
            }


            //Map<String, String> excelObj = BeanUtils.describe(excelData.get(i));

            // excelData 에 대한 list 에 map 을 가지고 있는 형태로 수정함
            Map<String, String> excelObj = (Map<String, String>) excelData.get(i);
            row = xss.createRow(i + 1);

            for (int x = 0; x < hl; x++) {
                if (!excelObj.containsKey(headers.get(x).get("fieldName")))
                    continue;

                cell = row.createCell(x);
                String data = excelObj.get(headers.get(x).get("fieldName"));
                String dataType = (String) headers.get(x).get("dataType");

                if (dataType == null || "-".equals(data)) {
                    cell.setCellValue(data);
                } else {
                    if ("number".equals(dataType)) {
                        cell.setCellType(XSSFCell.CELL_TYPE_NUMERIC);
                        cell.setCellValue(new Double(data));
                    } else if ("string".equals(dataType)) {
                        cell.setCellType(XSSFCell.CELL_TYPE_STRING);
                        cell.setCellValue(data);
                    } else {
                        cell.setCellType(XSSFCell.CELL_TYPE_BLANK);
                        cell.setCellValue(data);
                    }
                }
                cell.setCellStyle(cellStyle);
            }

            //Auto size all the columns
            for (int x = 0; x < xss.getRow(0).getPhysicalNumberOfCells(); x++) {
                xss.autoSizeColumn(x);
                if (xss.getColumnWidth(x) == 0) {
                    // autosize failed use MIN_WIDTH
                    xss.setColumnWidth(x, 200);
                }
            }

        }

        return xswk;
    }


    /****
     *
     * @param parameter : parameters
     * @param excelData : db select data
     * @return
     * @throws Exception
     * @date 2017.11.23 cho yong dong make
     * @desc parameter 의 headers 의 fieldWidth 로 header width 를 설정 한다.
     * 			Auto size all the columns 부분을 제거 한다.
     */
    @SuppressWarnings("unchecked")
    public XSSFWorkbook makeExcelDataHeaderWidth(ExcelRequest parameter, List<Object> excelData) throws Exception {

        if (excelData == null)
            return null;

        XSSFWorkbook xswk = new XSSFWorkbook();
        XSSFFont headerFont = getDefaultFont(xswk, "Arial", true);
        XSSFFont cellFont = getDefaultFont(xswk, "굴림", false);
        CellStyle headerStyle = getDefaultCellStyle(xswk, headerFont, HSSFColor.GREY_25_PERCENT.index);
        CellStyle cellStyle = getDefaultCellStyle(xswk, cellFont, HSSFColor.WHITE.index);

        XSSFSheet xss = xswk.createSheet();
        xswk.setSheetName(0, parameter.getFileName());

        XSSFRow row = null;
        XSSFCell cell = null;

        List<Map<String, Object>> headers = parameter.getHeaders();

        int l = excelData.size();
        int hl = headers.size();


        // header width setting
        for (int x = 0; x < hl; x++) {
            int vWidth = (int) (double) headers.get(x).get("fieldWidth");

            if (vWidth < 1) {
                xss.setColumnWidth(x, 2000);
            } else {
                xss.setColumnWidth(x, vWidth);
            }
        }

        for (int i = 0; i < l; i++) {
            row = xss.createRow(0);

            for (int j = 0; j < hl; j++) {
                cell = row.createCell(j);
                cell.setCellValue(URLDecoder.decode((String) headers.get(j).get("headerName"), "utf-8"));
                cell.setCellStyle(headerStyle);
            }


            //Map<String, String> excelObj = BeanUtils.describe(excelData.get(i));

            // excelData 에 대한 list 에 map 을 가지고 있는 형태로 수정함
            Map<String, String> excelObj = (Map<String, String>) excelData.get(i);
            row = xss.createRow(i + 1);

            for (int x = 0; x < hl; x++) {
                if (!excelObj.containsKey(headers.get(x).get("fieldName")))
                    continue;

                cell = row.createCell(x);
                String data = excelObj.get(headers.get(x).get("fieldName"));
                String dataType = (String) headers.get(x).get("dataType");

                if (dataType == null || "-".equals(data)) {
                    cell.setCellValue(data);
                } else {
                    if ("number".equals(dataType)) {
                        cell.setCellType(XSSFCell.CELL_TYPE_NUMERIC);
                        cell.setCellValue(new Double(data));
                    } else if ("string".equals(dataType)) {
                        cell.setCellType(XSSFCell.CELL_TYPE_STRING);
                        cell.setCellValue(data);
                    } else {
                        cell.setCellType(XSSFCell.CELL_TYPE_BLANK);
                        cell.setCellValue(data);
                    }
                }
                cell.setCellStyle(cellStyle);
            }

            /*** 위에서 width 를 잡아서 없앤다. 2017.11.23
             //Auto size all the columns
             for (int x = 0; x < xss.getRow(0).getPhysicalNumberOfCells(); x++) {
             xss.autoSizeColumn(x);
             if (xss.getColumnWidth(x) == 0) {
             // autosize failed use MIN_WIDTH
             xss.setColumnWidth(x, 100);
             }
             }
             ************************************/

        }

        return xswk;
    }

    @SuppressWarnings("unchecked")
    public HSSFWorkbook makeExcelDataHSSF(ExcelRequest parameter, List<Object> excelData) throws Exception {

        if (excelData == null)
            return null;

        HSSFWorkbook hswk = new HSSFWorkbook();
        HSSFSheet hss = hswk.createSheet("new sheet");

        HSSFFont headerFont = getDefaultFont(hswk, "Arial", true);
        HSSFFont cellFont = getDefaultFont(hswk, "굴림", false);
        CellStyle headerStyle = getDefaultCellStyle(hswk, headerFont, HSSFColor.GREY_25_PERCENT.index);
        CellStyle cellStyle = getDefaultCellStyle(hswk, cellFont, HSSFColor.WHITE.index);

        hswk.setSheetName(0, parameter.getFileName());

        HSSFRow row = null;
        HSSFCell cell = null;

        List<Map<String, Object>> headers = parameter.getHeaders();

        int l = excelData.size();
        for (int i = 0; i < l; i++) {
            row = hss.createRow(0);

            int hl = headers.size();
            for (int j = 0; j < hl; j++) {
                cell = row.createCell(j);
                cell.setCellValue(URLDecoder.decode((String) headers.get(j).get("headerName"), "utf-8"));
                cell.setCellStyle(headerStyle);
            }

            Map<String, String> excelObj = (Map<String, String>) excelData.get(i);
            //Map<String, String> excelObj = BeanUtils.describe(excelData.get(i));
            row = hss.createRow(i + 1);

            for (int x = 0; x < hl; x++) {
                if (!excelObj.containsKey(headers.get(x).get("fieldName")))
                    continue;

                cell = row.createCell(x);
                String data = "";
                if (excelObj.get(headers.get(x).get("fieldName")) != null) {
                    data = String.valueOf(excelObj.get(headers.get(x).get("fieldName")));
                }
                String dataType = (String) headers.get(x).get("dataType");

                if (dataType == null || "-".equals(data)) {
                    cell.setCellValue(data);
                } else {
                    if ("number".equals(dataType)) {
                        cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);

                        if (data != null && !data.equals("")) {
                            cell.setCellValue(new Double(data));
                        } else {
                            cell.setCellValue("");
                        }

                    } else if ("string".equals(dataType)) {
                        cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                        cell.setCellValue(data);
                    } else {
                        cell.setCellType(HSSFCell.CELL_TYPE_BLANK);
                        cell.setCellValue(data);
                    }
                }
                cell.setCellStyle(cellStyle);
            }

            if(i == l-1){
                for(int k=0;k<row.getLastCellNum();k++){
                    hss.autoSizeColumn(k);
                    int width = hss.getColumnWidth(k);
                    hss.setColumnWidth(k, width + 150);
                }
            }
        }

        return hswk;
    }

    private XSSFFont getDefaultFont(XSSFWorkbook xswk, String fontName, Boolean bold) {
        XSSFFont font = xswk.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName(fontName);
        font.setBold(bold);
        return font;
    }

    private HSSFFont getDefaultFont(HSSFWorkbook hswk, String fontName, Boolean bold) {
        HSSFFont font = hswk.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName(fontName);
        font.setBold(bold);
        return font;
    }

    private CellStyle getDefaultCellStyle(XSSFWorkbook xswk, XSSFFont font, short backgroundStyle) {
        CellStyle cellStyle = xswk.createCellStyle();
        cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
        cellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        cellStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        cellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
        cellStyle.setFillForegroundColor(backgroundStyle);
        cellStyle.setFont(font);
        return cellStyle;
    }

    private CellStyle getDefaultCellStyle(HSSFWorkbook hswk, HSSFFont font, short backgroundStyle) {
        CellStyle cellStyle = hswk.createCellStyle();
        cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
        cellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        cellStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        cellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
        cellStyle.setFillForegroundColor(backgroundStyle);
        cellStyle.setFont(font);
        return cellStyle;
    }

    public int getRepeatPropertyCnt(Map<String, Object> map, String property) {
        int cnt = 0;
        Iterator it = map.keySet().iterator();
        while (it.hasNext()) {

            String key = (String) it.next();
            if (key.startsWith(property)) {
                ++cnt;
                continue;
            }
        }
        return cnt;
    }
}

