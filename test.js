/*jslint evil: true */
/*jslint vars: true */
/*jslint forin: true */


function compile() {
    "use strict";

    var radi8 = false;
    var option1 = false;
    var option2 = false;
    
    if (!document.getElementById("radio1-1").checked && !document.getElementById("radio1-2").checked) {
        window.alert("Please choose an output option!");
        return;
    } else if (document.getElementById("radio1-2").checked) {
        radi8 = true;
        if (document.getElementById("checkbox1").checked) {
            option1 = true;
        }
        if (document.getElementById("checkbox2").checked) {
            option2 = true;
        }
    } else {
        if (document.getElementById("checkbox3").checked) {
            option1 = true;
        }
    }
    
    var program = document.getElementById("programtext").value;
    
    var labels = {};
    
    var index = 0;
    var currline = 0x000;
    var currword = "";
    
    var chr;
    while (index < program.length) {
        chr = program.charAt(index);
        
        if (chr === "," && currword.length > 0) {
            labels[currword] = currline;
        } else if (chr === "\n") {
            if (currword.substr(0, 3) === "ORG") {
                currline = parseInt(currword.substr(4, 3), 16) - 0x1;
            }
            currline += 0x1;
            currword = "";
        } else {
            currword += chr;
        }
        
        index += 1;
    }
    
    index = 0;
    currline = 0x000;
    currword = "";
    
    var binary = [];
    var bindex = 0;
    
    program += "\n";
    
    while (index < program.length) {
        chr = program.charAt(index);
        
        
        if (chr === ",") {
            currword = "";
        } else if (chr === "\n") {
            var cmd = currword.substr(0, 3);
            var indirect = false;
            if (currword.lastIndexOf("I") > 7) {
                indirect = true;
            }
            
            //window.alert(currline.toString(16) + ": " + currword + "       I:" + indirect);
            var obj;
            switch (cmd) {
            case "ORG":
                currline = parseInt(currword.substr(4, 3), 16) - 0x1;
                break;
            case "DEC":
                binary.push({line: currline.toString(16), instr: currword.substr(4)});
                break;
            case "HEX":
                binary.push({line: currline.toString(16), instr: currword.substr(4)});
                break;
            case "BIN":
                binary.push({line: currline.toString(16), instr: currword.substr(4)});
                break;
            case "OCT":
                binary.push({line: currline.toString(16), instr: currword.substr(4)});
                break;
            case "CLA":
                binary.push({line: currline.toString(16), instr: 0x7800});
                break;
            case "CLE":
                binary.push({line: currline.toString(16), instr: 0x7400});
                break;
            case "CMA":
                binary.push({line: currline.toString(16), instr: 0x7200});
                break;
            case "CME":
                binary.push({line: currline.toString(16), instr: 0x7100});
                break;
            case "CIR":
                binary.push({line: currline.toString(16), instr: 0x7080});
                break;
            case "CIL":
                binary.push({line: currline.toString(16), instr: 0x7040});
                break;
            case "INC":
                binary.push({line: currline.toString(16), instr: 0x7020});
                break;
            case "SPA":
                binary.push({line: currline.toString(16), instr: 0x7010});
                break;
            case "SNA":
                binary.push({line: currline.toString(16), instr: 0x7008});
                break;
            case "SZA":
                binary.push({line: currline.toString(16), instr: 0x7004});
                break;
            case "SZE":
                binary.push({line: currline.toString(16), instr: 0x7002});
                break;
            case "HLT":
                binary.push({line: currline.toString(16), instr: 0x7001});
                break;
            case "INP":
                binary.push({line: currline.toString(16), instr: 0xF800});
                break;
            case "OUT":
                binary.push({line: currline.toString(16), instr: 0xF400});
                break;
            case "SKI":
                binary.push({line: currline.toString(16), instr: 0xF200});
                break;
            case "SKO":
                binary.push({line: currline.toString(16), instr: 0xF100});
                break;
            case "ION":
                binary.push({line: currline.toString(16), instr: 0xF080});
                break;
            case "IOF":
                binary.push({line: currline.toString(16), instr: 0xF040});
                break;
            case "AND":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0x8000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x0000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            case "ADD":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0x9000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x1000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            case "LDA":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0xA000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x2000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            case "STA":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0xB000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x3000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            case "BUN":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0xC000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x4000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            case "BSA":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0xD000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x5000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            case "ISZ":
                if (indirect) {
                    obj = {line: currline.toString(16), instr: 0xE000};
                } else {
                    obj = {line: currline.toString(16), instr: 0x6000};
                }
                obj.instr += labels[currword.substr(4, 3)];
                binary.push(obj);
                break;
            }
            
            currline += 0x1;
            currword = "";
        } else {
            currword += chr;
        }
        
        index += 1;
    }
    
    var i;
    var str = "";
    
    if (!radi8) {
        for (i = 0; i < binary.length; i += 1) {
            if (option1) {
                str += binary[i].line.toString(16) + "\t";
            }
            str += binary[i].instr.toString(16) + "\n";
        }
    } else {
        var eight = 0;
        if (!option1) {
            for (i = 0; i < binary.length; i += 1) {
                str += binary[i].instr.toString(16);
                if (eight === 7) {
                    eight = 0;
                    str += "\n";
                } else {
                    eight += 1;
                    str += " ";
                }
            }
        } else {
            var ram = [4096];
            for (i = 0; i < 4096; i += 1) {
                if (option2) {
                    ram[i] = "0000";
                } else {
                    ram[i] = "XXXX";
                }
            }
            
            for (i = 0; i < binary.length; i += 1) {
                ram[parseInt(binary[i].line.toString(16), 16)] = binary[i].instr.toString(16);
            }
            
            for (i = 0; i < ram.length; i += 1) {
                str += ram[i];
                if (eight === 7) {
                    eight = 0;
                    str += "\n";
                } else {
                    eight += 1;
                    str += " ";
                }
            }
        }
    }
    
    return str;
}
