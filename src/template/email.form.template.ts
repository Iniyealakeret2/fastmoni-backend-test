export type MessageInterface = {
  beneficiary_name: string;
};

export const messageTemplate = ({ beneficiary_name }: MessageInterface) => `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Fanful, Inc.</a>
      </div>
      <p style="font-size:1.1em">Hi There,</p>
      <p>${beneficiary_name} says thank you for your continues support</p>
      <p style="font-size:0.9em;">Regards,<br />Fanful Inc.</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Fastmoni, Inc. </p>
        <p>Lagos</p>
        <p>Nigeria</p>
      </div>
    </div>
</div>
`;
