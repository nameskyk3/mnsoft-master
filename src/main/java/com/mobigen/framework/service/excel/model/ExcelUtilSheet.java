package com.mobigen.framework.service.excel.model;

import lombok.Data;
import org.apache.poi.hssf.usermodel.HSSFSheet;

@Data
public class ExcelUtilSheet {
    private int offsetCol = 0;
    private int rowIndex = 0;
    private int maxCols = 0;

    public ExcelUtilSheet (int offsetCol, int rowIndex, int maxCols) {
        this.offsetCol = offsetCol;
        this.rowIndex = rowIndex;
        this.maxCols = maxCols;
    }
}
