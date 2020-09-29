package com.mobigen.framework.service.excel.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class ExcelRequest {
    private String fileName;
    private String queryId;
    private long datacenterId;
    private Map<String, Object> parameter;
    private List<Map<String, Object>> headers;

    private int limit;  // Excel Limit

    private Map<String, String> bodyMap = new HashMap<String, String>();

    private List<String> headerList = new ArrayList<String>();
    private List<Object> bodyList = new ArrayList<Object>();
}
