package com.mobigen.framework.service.excel;

import com.mobigen.framework.service.excel.model.ExcelUtilSheet;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.awt.font.FontRenderContext;
import java.awt.font.LineBreakMeasurer;
import java.awt.font.TextAttribute;
import java.io.*;
import java.text.AttributedString;
import java.util.ArrayList;
import java.util.List;

public class ExcelUtil {
    private int offsetCol = 0;
    private int rowIndex = 0;
    private int maxCols = 0;

    private HSSFWorkbook workbook;
    private ArrayList<ExcelUtilSheet> sheets;
    private HSSFSheet sheet;
    private int currentSheetIndex = 0;
    private HSSFCellStyle headerCellStyle;
    private HSSFCellStyle defaultCellStyle;

    public ExcelUtil(String sheetName) {
        workbook = new HSSFWorkbook();
        sheets = new ArrayList<>();
        sheet = workbook.createSheet(sheetName);
        currentSheetIndex = 0;
        headerCellStyle = createCellStyle(true, (short) 0);
        defaultCellStyle = createCellStyle(false, (short) 0);
    }

    private void setSheetInfo () {
        ExcelUtilSheet info = new ExcelUtilSheet(offsetCol, rowIndex, maxCols);
        if (sheets.size() < 1 || sheets.size() >= currentSheetIndex) {
            sheets.add(info);
        } else {
            sheets.set(currentSheetIndex, info);
        }
    }

    public void setOffset(int col, int row) {
        offsetCol = col;
        rowIndex = row;
    }

    public void setCurrentSheetIndex(int index) {
        setSheetInfo();
        int sheetSize = this.workbook.getNumberOfSheets();
        if (sheetSize < index)
            return;
        currentSheetIndex = index;

        ExcelUtilSheet sh = sheets.get(currentSheetIndex);
        offsetCol = sh.getOffsetCol();
        rowIndex = sh.getRowIndex();
        maxCols = sh.getMaxCols();
        sheet = this.workbook.getSheetAt(currentSheetIndex);
    }

    public void addSheet(String sheetName) {
        setSheetInfo();
        if (workbook == null)
            workbook = new HSSFWorkbook();
        sheet = workbook.createSheet(sheetName);
        currentSheetIndex++;
    }

    public void addRow(List<String> rows) {
        addRow(false, rows);
    }

    public int getRowIndex() {
        return rowIndex;
    }

    public void setCellWidth(int cellnum, int width) {
        sheet.setColumnWidth(cellnum, width);
    }

    public void setCell(int cellnum, int rownum, XSSFCellStyle cellStyle, String cellValue) {
        HSSFRow row = sheet.getRow(rownum);
        if (row == null) {
            row = sheet.createRow(rownum);
        }

        HSSFCell cell = row.getCell(cellnum);
        if (cell == null) {
            cell = row.createCell(cellnum, XSSFCell.CELL_TYPE_STRING);
        }
        cell.setCellStyle(cellStyle);
        cell.setCellValue(cellValue);
    }

    public void addRow(Boolean headerFlag, List<String> cellStrings) {
        HSSFRow header = sheet.createRow(rowIndex++);
        int cellIndex = offsetCol;
        for (String value : cellStrings) {
            HSSFCell cell = header.createCell(cellIndex++, XSSFCell.CELL_TYPE_STRING);
            cell.setCellValue(value);
            if (headerFlag) {
                cell.setCellStyle(headerCellStyle);
            } else {
                cell.setCellStyle(defaultCellStyle);
            }
        }
        if (maxCols < cellIndex) {
            maxCols = cellIndex;
        }
    }

    public HSSFCellStyle createCellStyle(Boolean header, short boldweight) {
        HSSFCellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        if (header == true) {
            cellStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
            cellStyle.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
        }
        setSolidBorder(cellStyle);

        if (boldweight != 0) {
            Font headerFont = this.sheet.getWorkbook().createFont();
            headerFont.setBoldweight(boldweight);
            cellStyle.setFont(headerFont);
        }
        return cellStyle;
    }

    public void setFontHeight(int cellnum, int rownum, int height) {
        sheet.getRow(rownum).getCell(cellnum).getCellStyle().getFont(this.workbook).setFontHeight((short)height);
    }

    public void setCellAlignment(int cellnum, int rownum, HorizontalAlignment align) {
        sheet.getRow(rownum).getCell(cellnum).getCellStyle().setAlignment(align);
    }

    public void setCellWrapText(int cellnum, int rownum, boolean b) {
        HSSFRow row = sheet.getRow(rownum);
        HSSFCellStyle rowStyle = row.getRowStyle();
        if (rowStyle == null) {
            HSSFCellStyle cellStyle = sheet.getWorkbook().createCellStyle();
            cellStyle.setWrapText(b);
            row.setRowStyle(cellStyle);
        } else {
            rowStyle.setWrapText(b);
        }
        row.getCell(cellnum).getCellStyle().setWrapText(b);
    }

    // hex to byte[]
    public byte[] hexToByteArray(String hex) {
        if (hex == null || hex.length() == 0) {
            return null;
        }

        byte[] ba = new byte[hex.length() / 2];
        for (int i = 0; i < ba.length; i++) {
            ba[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return ba;
    }

    public void setSolidBorder(HSSFCellStyle cellStyle) {
        cellStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setBorderBottom(CellStyle.BORDER_THIN);
        cellStyle.setBorderTop(CellStyle.BORDER_THIN);
        cellStyle.setBorderRight(CellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(CellStyle.BORDER_THIN);
    }

    public void write(OutputStream outputStream) throws IOException {
        setSheetInfo();
        int sheetSize = this.workbook.getNumberOfSheets();
        for (int si = 0; si < sheetSize; si++) {
            HSSFSheet sh = this.workbook.getSheetAt(si);

            // adjust column width to fit the content
            for (int i = 0; i < maxCols; i++) {
                sh.autoSizeColumn(i);
                sh.setColumnWidth(i, Math.min(255 * 256, sh.getColumnWidth(i) + 1500));
            }
            for (int i = 0; i < offsetCol; i++) {
                setCellWidth(i, 900);
            }
        }

        try {
            this.workbook.setActiveSheet(0);
            this.workbook.write(outputStream);
        } catch (IOException e) {
        } finally {
            if (this.workbook != null)
                this.workbook.close();
        }
    }

    public void merge(int firstCol, int firstRow, int lastCol, int lastRow) {
        // 셀 병합
        sheet.addMergedRegion(new CellRangeAddress(firstRow, lastRow, firstCol, lastCol)); // 병합
    }

    public static int pxToEmu(int px) {
        return (int) Math.round(((double) px) * 72 * 20 * 635 / 96); // assume
        // 96dpi
    }

    public static int emuToPx(int emu) {
        return (int) Math.round(((double) emu) * 96 / 72 / 20 / 635); // assume
        // 96dpi
    }

    public float getDefaultRowHeightInPoints() {
        return this.sheet.getDefaultRowHeightInPoints();
    }

    public void setRowHeightInPoints(int rownum, float height) {
        sheet.getRow(rownum).setHeightInPoints(height);
    }

    public float getRowHeightInPoints(int rownum) {
        return sheet.getRow(rownum).getHeightInPoints();
    }

    /**
     * ROW 높이 자동 조절
     *
     * @param cellnum
     * @param rownum
     */
    public void setAutoRowFit(int cellnum, int rownum) {
        HSSFRow row = sheet.getRow(rownum);
        HSSFCell cell = row.getCell(cellnum);
        HSSFFont cellFont = cell.getCellStyle().getFont(this.workbook);
        int fontStyle = java.awt.Font.PLAIN;
        if (cellFont.getBold())
            fontStyle = java.awt.Font.BOLD;
        if (cellFont.getItalic())
            fontStyle = java.awt.Font.ITALIC;

        java.awt.Font currFont = new java.awt.Font(cellFont.getFontName(), fontStyle, cellFont.getFontHeightInPoints());

        String cellText = cell.getStringCellValue();
        AttributedString attrStr = new AttributedString(cellText);
        attrStr.addAttribute(TextAttribute.FONT, currFont);

        // Use LineBreakMeasurer to count number of lines needed for the text
        FontRenderContext frc = new FontRenderContext(null, true, true);
        LineBreakMeasurer measurer = new LineBreakMeasurer(attrStr.getIterator(), frc);
        int nextPos = 0;
        int lineCnt = 1;
        float columnWidthInPx = sheet.getColumnWidthInPixels(cellnum);
        while (measurer.getPosition() < cellText.length()) {
            nextPos = measurer.nextOffset(columnWidthInPx);
            lineCnt++;
            measurer.setPosition(nextPos);
        }
        int fromIndex = -1;
        while ((fromIndex = cellText.indexOf("\n", fromIndex + 1)) >= 0) {
            lineCnt++;
        }
        if (lineCnt > 1) {
            row.setHeightInPoints(
                    sheet.getDefaultRowHeightInPoints() * lineCnt * /* fudge factor */ 1.1f);
        }
    }

    public static List<List<String>> readExcel(File file) throws IOException, InvalidFormatException {
        return readExcel(new FileInputStream(file), file.getName(), 0);
    }

    public static List<List<String>> readExcel(File file, int sheetAt) throws IOException, InvalidFormatException {
        return readExcel(new FileInputStream(file), file.getName(), sheetAt);
    }

    public static List<List<String>> readExcel(InputStream is) throws IOException, InvalidFormatException {
        return readExcel(is, "xlsx", 0);
    }

    private static Workbook getWorkbook(InputStream inputStream, String fileName) throws IOException {
        Workbook workbook = null;

        if (fileName.endsWith("xlsx")) {
            workbook = new XSSFWorkbook(inputStream);
        } else if (fileName.endsWith("xls")) {
            workbook = new HSSFWorkbook(inputStream);
        } else {
            throw new IllegalArgumentException("The specified file is not Excel file");
        }

        return workbook;
    }

    public static List<List<String>> readExcel(InputStream is, String fileName, int sheetAt)
            throws IOException, InvalidFormatException {
        List<List<String>> resultList = new ArrayList<>();
        // 파일을 읽기위해 엑셀파일을 가져온다
        Workbook workbook = getWorkbook(is, fileName);
        int rowindex = 0;
        int columnindex = 0;
        // 시트 수 (첫번째에만 존재하므로 0을 준다)
        // 만약 각 시트를 읽기위해서는 FOR문을 한번더 돌려준다
        Sheet sheet = workbook.getSheetAt(sheetAt);
        // 행의 수
        int rows = sheet.getPhysicalNumberOfRows();
        for (rowindex = 0; rowindex < rows; rowindex++) {
            // 행을 읽는다
            Row row = sheet.getRow(rowindex);
            resultList.add(new ArrayList<String>());
            if (row != null) {
                // 셀의 수
                int cells = row.getPhysicalNumberOfCells();
                for (columnindex = 0; columnindex <= cells; columnindex++) {
                    // 셀값을 읽는다
                    Cell cell = row.getCell(columnindex);
                    String value = "";
                    // 셀이 빈값일경우를 위한 널체크
                    if (rowindex == 0 && cell == null) {
                        continue;
                    }
                    if (cell != null) {
                        // 타입별로 내용 읽기
                        switch (cell.getCellType()) {
                            case Cell.CELL_TYPE_FORMULA:
                                value = cell.getCellFormula();
                                break;
                            case Cell.CELL_TYPE_NUMERIC:
                                value = String.format("%1$,.0f", cell.getNumericCellValue());
                                break;
                            case Cell.CELL_TYPE_STRING:
                                value = cell.getStringCellValue() + "";
                                break;
                            case Cell.CELL_TYPE_BLANK:
                                value = cell.getBooleanCellValue() + "";
                                break;
                            case Cell.CELL_TYPE_ERROR:
                                value = cell.getErrorCellValue() + "";
                                break;
                        }
                    }
                    if ("false".equals(value)) {
                        value = "";
                    }
                    resultList.get(rowindex).add(value);
                }
            }
        }
        workbook.close();
        return resultList;
    }
}