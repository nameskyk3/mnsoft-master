package com.mobigen.framework.configuration;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener {
    @Override
    public void sessionCreated(HttpSessionEvent se) {

        se.getSession().setMaxInactiveInterval(6); //세션만료60분

    }



    @Override
    public void sessionDestroyed(HttpSessionEvent se) {

    }

}

