
export class IDGen{
    static seq: number =  1;
    static genID(): number{
        return IDGen.seq++;
    }
}