package com.mobigen.framework.utility;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobigen.framework.result.JsonResult;
import com.mobigen.framework.security.SessionManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.ws.rs.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class RestUtil {

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    SessionManager sessionManager;

    public RestUtil() {
    }

    // 조회 Get Plain JSON - Get - parameter를 url 에 붙여서 진행한다.
    public Object getJson(String Url) {
        if (Url == null || Url.equals("")) {
            return new Exception("Url is Null");
        }

        ResponseEntity<Object> responseEntity = null;
        Object paramObject = null;

        return exchange(Url, HttpMethod.GET, paramObject);
    }

    //조회시 파라메터가 필요한 경우
    public Object getJson(String Url, HashMap<String, String> param) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(Url);
        if (param != null) {
            for (Map.Entry<String, String> entry : param.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                builder.queryParam(key, value);
            }
        }
        return getJson(builder.build().toUriString());
    }


    // 등록 - Post exchange - Create - parameter 객체를 paramObject 로 진행한다. 없으면 null
    public Object create(String Url, Object paramObject) {
        if (Url == null || Url.equals("")) {
            return new Exception("Url is Null");
        }

        return exchange(Url, HttpMethod.POST, paramObject);
    }

    // 수정 - Put exchange - Update - parameter 객체를 paramObject 로 진행한다. 없으면 null
    public Object update(String Url, Object paramObject) {
        if (Url == null || Url.equals("")) {
            return new Exception("Url is Null");
        }

        return exchange(Url, HttpMethod.PUT, paramObject);
    }

    // 삭제 - Delete - parameter 객체를 paramObject 로 진행한다. 없으면 null
    public Object delete(String Url, Object paramObject) {
        if (Url == null || Url.equals("")) {
            return new Exception("Url is Null");
        }

        return exchange(Url, HttpMethod.DELETE, paramObject);
    }

    // Post exchange - exchange
    public JsonResult exchange(String Url, HttpMethod httpMethod, Object paramObject) {
        log.debug("http : " + httpMethod + ", Url : " + Url);
        if (paramObject != null) {
            log.debug("paramObject : " + paramObject.toString());
        }

        restTemplate = new RestTemplate();
        JsonResult jsonResult = new JsonResult();
        ResponseEntity<Object> responseEntity = null;
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);
             HttpEntity request = null;
            if (paramObject != null) {
                request = new HttpEntity(paramObject, headers);
            } else {
                request = new HttpEntity(headers);
            }
            responseEntity = restTemplate.exchange(Url, httpMethod, request, Object.class);
            if (responseEntity.getBody() instanceof List) {
                jsonResult.setData(responseEntity.getBody());
                jsonResult.setResult(1);
            } else if (responseEntity.getBody() instanceof HashMap) {
                HashMap hashMap = (HashMap) responseEntity.getBody();
                if (hashMap != null) {
                    jsonResult.setData(hashMap);
                    jsonResult.setResult(1);
                } else {
                    jsonResult.setResult(1);
                }

            } else {
                jsonResult.setResult(1);
            }

        } catch (BadRequestException e) { // 400 - Bad Request
            log.error("400 - " + e.toString());
            throw new BadRequestException(e);
        } catch (NotAuthorizedException e) { // 401 - Unauthorized
            log.error("401 - " + e.toString());
            throw new NotAuthorizedException(e);
        } catch (ForbiddenException e) { // 403 - Forbidden
            log.error("403 - " + e.toString());
            throw new ForbiddenException(e);
        } catch (NotFoundException e) { // 404 - Not found
            log.error("404 - " + e.toString());
            throw new NotFoundException(e);
        } catch (HttpClientErrorException e) {  // 중복체크메세지등 화면에 노출되는 에러메세지를 받아오게 되있음
            String str = e.getResponseBodyAsString();
            HashMap map = convertMap(str);
            String message = String.valueOf(map.get("message"));
            jsonResult.setMessage(message);
            jsonResult.setResult(0);
            log.error(e.getStatusCode().toString() + " - " + jsonResult.getMessage());
        } catch (InternalServerErrorException e) { // 500 - Internal Server Error
            log.error("500 - " + e.toString());
            throw new InternalServerErrorException(e);
        } catch (HttpServerErrorException e) { // 중복체크메세지등 화면에 노출되는 에러메세지를 받아오게 되있음 ,자바에러 서버에러등메세지도 그대로 받아옴
            String str = e.getResponseBodyAsString();
            HashMap map = convertMap(str);
            String message = String.valueOf(map.get("message"));
            jsonResult.setMessage(message);
            jsonResult.setResult(0);

        } catch (Exception e) {
            String message = e.getMessage();
            log.error("e  - " + e.toString());
            throw new InternalServerErrorException(message);
        }
        return jsonResult;
    }

    private HashMap convertMap(String str) {
        HashMap data = new HashMap();
        try {
            ObjectMapper mapper = new ObjectMapper();
            data = mapper.readValue(str, HashMap.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return data;
    }

    public static boolean isError(HttpStatus status) {
        HttpStatus.Series series = status.series();
        return (HttpStatus.Series.CLIENT_ERROR.equals(series)
                || HttpStatus.Series.SERVER_ERROR.equals(series));
    }


}

