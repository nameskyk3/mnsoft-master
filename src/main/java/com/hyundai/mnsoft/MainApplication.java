package com.hyundai.mnsoft;

import com.hyundai.mnsoft.comon.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Slf4j
@SpringBootApplication
@EnableAspectJAutoProxy
@EnableCaching
@EnableAsync
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com"})
public class MainApplication implements CommandLineRunner {

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        log.debug("PROJECT_NAME - " + Constants.PROJECT_NAME);
        log.debug("PROJECT_HEADER - " + Constants.PROJECT_HEADER);
        //        log.debug("ORCHESTRATION_URL - " + Constants.ORCHESTRATION_URL);
//        log.debug("DATAPLATFORM_ALARM_URL - " + Constants.DATAPLATFORM_ALARM_URL);
//        log.debug("DATAPLATFORM_RESOURCE_URL - " + Constants.DATAPLATFORM_RESOURCE_URL);
//        log.debug("DATAPLATFORM_DATA_URL - " + Constants.DATAPLATFORM_DATA_URL);
//        log.debug("COLLECTOR_URL - " + Constants.COLLECTOR_URL);
//        log.debug("ACTIVEMQ_STOMP_PORT - " + Constants.ACTIVEMQ_STOMP_PORT);
//        log.debug("ACTIVEMQ_IP - " + Constants.ACTIVEMQ_IP);
//        log.debug("WS-PORT - " + Constants.WSPORT);
//        log.debug("TEST - " + Constants.TEST);
//        log.debug("ANALYTICS_FLAG - " + Constants.ANALYTICS_FLAG);
//        log.debug("TANGO_USER_FLAG - " + Constants.TANGO_USER_FLAG);

//        log.debug("PHYSICAL_LAYER_FLAG - " + Constants.PHYSICAL_LAYER_FLAG);
//        log.debug("COLLECT_PERIOD - " + Constants.PROJECT_NAME);
//        log.debug("STOMP_PORT - " + Constants.STOMP_PORT);
//        log.debug("MAX_CHART_POINT - " + Constants.MAX_CHART_POINT);
////        log.debug("KEYSTORE_PASSWORD - " + Constants.KEYSTORE_PASSWORD);
//        log.debug("KEYSTORE_TYPE - " + Constants.KEYSTORE_TYPE);
//        log.debug("SERVER_KEYSTORE_PATH - " + Constants.SERVER_KEYSTORE_PATH);
//        log.debug("TRUST_KEYSTORE_PATH - " + Constants.TRUST_KEYSTORE_PATH);
//        log.debug("SSL_ENABLED - " + Constants.SSL_ENABLED);
//        log.debug("RESOURCE_POPUP_USAGE_EXPAND - " + Constants.RESOURCE_POPUP_USAGE_EXPAND);
//        log.debug("VERSION_INFO - " + Constants.VERSION_INFO);
//        jasyptStringEncryptor(Constants.KEYSTORE_PASSWORD);
    }


    // yml 설정 안먹어서 임시
    /*@Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize("1240MB");
        factory.setMaxRequestSize("1240MB");
        return factory.createMultipartConfig();
    }*/

//    public static String desDecrypt(String value) {
//        String returnValue = "";
//        try {
//            StandardPBEStringEncryptor pbeEnc = new StandardPBEStringEncryptor();
//            pbeEnc.setAlgorithm("PBEWithMD5AndDES");
//            pbeEnc.setPassword("t-core-2019"); //2번 설정의 암호화 키를 입력
//            returnValue = pbeEnc.decrypt(value);
//        }
//        catch(Exception e) {
//            e.printStackTrace();
//        }
//        return returnValue;
//    }

    // 암호다시 풀때 사용
//    public void jasyptStringEncryptor(String value)  throws Exception {
//        StandardPBEStringEncryptor pbeEnc = new StandardPBEStringEncryptor();
//        pbeEnc.setAlgorithm("PBEWithMD5AndDES");
//        pbeEnc.setPassword("t-core-2019"); //2번 설정의 암호화 키를 입력
//
////        String enc = pbeEnc.encrypt("1234"); //암호화 할 내용
//        String enc = pbeEnc.encrypt(value); //암호화 할 내용
//        System.out.println(enc);
//        String des2 = pbeEnc.decrypt(enc);
//        System.out.println(des2);
//        //테스트용 복호화
////        String des = pbeEnc.decrypt("1zSYTqGTjgdGSpxeeVuwU/D7AqRNOIc2KBut5xDwU8xlKc58ICJq5w==");
////        String des2 = pbeEnc.decrypt("yARhuSz1CzTut/U17aNtpv256bPOOyG1pibVt0K85mr8C5UniPaVsw==");
//    }

    // 세션 테스트 할때 사용
    /*@Bean
    public HttpSessionListener httpSessionListener(){
        return new SessionListener();
    }*/
}
