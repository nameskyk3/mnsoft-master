package com.hyundai.mnsoft.test;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class TestService {

    public ArrayList getTestList() {
        ArrayList list = new ArrayList();
        HashMap map = new HashMap();
        map.put("column1", "11");
        map.put("column2", "22");
        list.add(map);

        map = new HashMap();
        map.put("column1", "33");
        map.put("column2", "44");
        list.add(map);

        return list;
    }
}
