package com.mobigen.framework.utility;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

import org.springframework.context.ApplicationContext;

public class BeanUtils {
     
    public static Object getBean(String beanId) {
         
        ApplicationContext applicationContext = ApplicationContextProvider.getApplicationContext();
 
        if( applicationContext == null ) {
            throw new NullPointerException("Spring의 ApplicationContext초기화 안됨");
        }
         
        /*
        String[] names = applicationContext.getBeanDefinitionNames();
        for (int i=0; i<names.length; i++) {
            System.out.println(names[i]);
        }
        */
         
        return applicationContext.getBean(beanId);
    }

    public static Object getValue(Object o, String field) throws Exception {
    	for (Method method : o.getClass().getDeclaredMethods()) {
    	    if (Modifier.isPublic(method.getModifiers())
    	        && method.getParameterTypes().length == 0
    	        && method.getReturnType() != void.class
    	        && (method.getName().equals(field))
    	    ) {
    	        Object value = method.invoke(o);
    	        return value;
    	    }
    	}
    	
    	return null;
    }
}


