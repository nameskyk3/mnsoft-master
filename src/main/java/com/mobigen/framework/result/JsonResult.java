package com.mobigen.framework.result;

import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;

@Slf4j
public class JsonResult {
    public static final int RESULT_SUCCESS = 1;
    public static final int RESULT_FAIL = 0;

    public JsonResult() {

    }

    public JsonResult(Object value) {
        this.setData(value);
    }

    private int result = RESULT_FAIL;

    public int getResult() {
        return result;
    }

    public void setResult(int result) {
        this.result = result;
    }

    private String message = "";

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
        this.result = RESULT_FAIL;

        log.error(message);
    }

    public void setMessage(Exception e) {
        if (e instanceof SQLException) {
            this.message = e.getMessage();
        } else {
            this.message = e.getMessage();
        }

        log.error(message);
        this.result = RESULT_FAIL;
    }

    public void setMessage(String message, Exception e) {
        this.message = message;
        this.result = RESULT_FAIL;
        log.error(message, e);
    }

    private Object data = null;

    public Object getData() {
        return data;
    }

    public void setData(Object value) {
        data = value;
        this.result = RESULT_SUCCESS;
    }

    private boolean silence = false;

    public boolean getSilence() {
        return silence;
    }

    public void setSilence(boolean value) {
        this.silence = value;
    }
}
