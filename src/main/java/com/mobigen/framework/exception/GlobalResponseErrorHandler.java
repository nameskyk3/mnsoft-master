package com.mobigen.framework.exception;

import com.mobigen.framework.utility.RestUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;

@Slf4j
@Component
@ControllerAdvice
public class GlobalResponseErrorHandler implements ResponseErrorHandler {

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        log.error("Response error: {} {}", response.getStatusCode(), response.getStatusText());
    }

    /*@Override
    public boolean hasError(ClientHttpResponse response) throws IOException {

        if ((response.getStatusCode() != HttpStatus.OK) || (response.getStatusCode() != HttpStatus.CREATED)
                || (response.getStatusCode() != HttpStatus.NO_CONTENT)) {

            log.debug("Status code: " + response.getStatusCode());
            log.debug("Response" + response.getStatusText());
            log.debug(response.getBody().toString());
            return true;
        }

        log.error("Status code: " + response.getStatusCode());
        log.error("Response" + response.getStatusText());
        log.error(response.getBody().toString());

        return false;
    }*/

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return RestUtil.isError(response.getStatusCode());
    }
}
