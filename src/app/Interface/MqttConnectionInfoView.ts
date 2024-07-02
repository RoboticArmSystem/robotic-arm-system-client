export interface MqttConnectionInfoView{
    ip: string;
    port: string;
    topic: string;
}

export interface MqttConnectionLogView{
    createtime: string;
    ip: string;
    port: string;
    topic: string;
    message: string;
}

export interface MqttConnectionLogView{
    createtime: string;
    ip: string;
    port: string;
    topic: string;
    message: string;
}

export interface EggTrayPositionChangeHistoryMessage{
    pId: string,
    positionChange: string,
    createtime: string 
}